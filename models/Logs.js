const db = require("../config/database");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
require("dayjs/locale/tr");

dayjs.extend(relativeTime);
dayjs.locale("tr");

class Logs {
  constructor(row) {
    this.id = row.id;
    this.urun_id = row.urun_id;
    this.hareket_turu = row.hareket_turu;
    this.irsaliye_fatura_no = row.irsaliye_fatura_no;
    this.miktar = row.miktar;
    this.yetkili_id = row.yetkili_id;
    this.created_at = row.created_at;
  }

  static async getLogs(filter = {}) {
    try {
      if (typeof filter === "string") {
        if (filter === "top6") {
          const [rows] = await db.query(`
          SELECT 
            u.urun_adi,
            SUM(ABS(h.miktar)) AS miktar
          FROM hareketler h
          JOIN urunler u ON h.urun_id = u.id
          WHERE h.created_at >= CURDATE() - INTERVAL 1 MONTH
          GROUP BY h.urun_id, u.urun_adi
          ORDER BY miktar DESC
          LIMIT 6
        `);
          return rows;
        }

        const opt = {};
        if (filter === "giris" || filter === "cikis") opt.type = filter;
        if (filter === "today") opt.last = "today";
        if (filter === "last5") opt.limit = 5;
        filter = opt;
      }

      const {
        type = null,
        category = null,
        last = null,
        search = null,
        limit = null,
      } = filter;

      let query = `
      SELECT 
        h.id AS hareket_id,
        h.urun_id,
        h.yetkili_id,
        u.birim_id,
        h.miktar,
        h.hareket_turu,
        h.irsaliye_fatura_no,
        h.eski_stok,
        h.created_at AS hareket_created_at,

        u.id AS urun_id,
        u.urun_adi,
        u.sku,
        u.kategori_id,
        u.mevcut_stok,
        u.min_stok,
        u.max_stok,
        u.tedarikci,

        k.ad_soyad AS yetkili_adi,

        b.id AS birim_id,
        b.ad
      FROM hareketler h
      JOIN urunler u ON h.urun_id = u.id
      JOIN users   k ON h.yetkili_id = k.id
      JOIN units   b ON u.birim_id = b.id
      WHERE 1 = 1
    `;

      const params = [];

      if (type === "giris" || type === "cikis") {
        query += " AND h.hareket_turu = ?";
        params.push(type);
      }

      if (category) {
        query += " AND u.kategori_id = ?";
        params.push(category);
      }

      if (last) {
        switch (last) {
          case "today":
            query += " AND DATE(h.created_at) = CURDATE()";
            break;
          case "7":
            query += " AND h.created_at >= NOW() - INTERVAL 7 DAY";
            break;
          case "30":
            query += " AND h.created_at >= NOW() - INTERVAL 30 DAY";
            break;
        }
      }

      if (search) {
        query += `
        AND (
          u.urun_adi LIKE ?
          OR u.sku LIKE ?
          OR k.ad_soyad LIKE ?
          OR h.id = ?
        )
      `;
        const like = `%${search}%`;
        params.push(like, like, like, isNaN(search) ? 0 : Number(search));
      }

      query += " ORDER BY h.created_at DESC";

      if (limit) {
        query += " LIMIT ?";
        params.push(Number(limit));
      }

      const [rows] = await db.query(query, params);

      return rows.map((row) => ({
        ...row,
        relative_time: dayjs(row.hareket_created_at).fromNow(),
      }));
    } catch (err) {
      console.error("Logs.getLogs hata: ", err);
      throw err;
    }
  }

  static async getLast15DaysStockMovements() {
    try {
      const [rows] = await db.query(`
        SELECT 
          DATE(created_at) AS tarih,
          SUM(
            CASE
              WHEN hareket_turu = 'giris' THEN miktar
              WHEN hareket_turu = 'cikis' THEN -miktar
              ELSE 0
            END
          ) AS net_miktar,
          COUNT(*) AS hareket_adedi
        FROM hareketler
        WHERE created_at >= CURDATE() - INTERVAL 14 DAY
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
      `);

      return rows;
    } catch (err) {
      console.error("Logs.getLast15DaysStockMovements hata:", err);
      throw err;
    }
  }

  static async getMostMovement() {
    try {
      let sql = `SELECT 
          u.urun_adi,
          k.kategori_adi,
          SUM(ABS(h.miktar)) AS miktar
          FROM hareketler h
          JOIN urunler u ON h.urun_id = u.id
          JOIN kategoriler k ON u.kategori_id = k.id
          WHERE h.created_at >= CURDATE() - INTERVAL 1 MONTH
          GROUP BY h.urun_id, u.urun_adi
          ORDER BY miktar DESC
          LIMIT 1;`;
      const [[row]] = await db.query(sql);
      return row;
    } catch (err) {
      console.error("Logs.getMostMovement hata: ", err);
      throw err;
    }
  }

  static async getLastEntriesForProducts(productIds) {
    if (!productIds || productIds.length === 0) return {};

    const placeholders = productIds.map(() => "?").join(",");

    const [rows] = await db.query(
      `
      SELECT urun_id, MAX(created_at) AS created_at
      FROM hareketler
      WHERE hareket_turu = 'giris'
        AND urun_id IN (${placeholders})
      GROUP BY urun_id
      `,
      productIds
    );

    const result = {};

    rows.forEach((row) => {
      result[row.urun_id] = {
        created_at: row.created_at,
        relative_time: dayjs(row.created_at).fromNow(),
      };
    });

    return result;
  }

  static async addLog(
    urun_id,
    hareket_turu,
    irsaliye_fatura_no,
    eski_stok,
    miktar,
    aciklama,
    yetkili_id
  ) {
    try {
      const sql = `
      INSERT INTO hareketler 
        (urun_id, hareket_turu, irsaliye_fatura_no, eski_stok, miktar, aciklama, yetkili_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

      const [result] = await db.query(sql, [
        urun_id,
        hareket_turu,
        irsaliye_fatura_no || null,
        eski_stok ?? null,
        miktar,
        aciklama || "",
        yetkili_id,
      ]);

      return result; // istersen insertId vs. kullanırsın
    } catch (err) {
      console.error("Logs.addLog hata:", err);
      throw err;
    }
  }

  static async getMonthlyStats() {
    try {
      const query = `
        WITH this_month AS (
          SELECT 
            SUM(CASE WHEN hareket_turu = 'giris' THEN miktar ELSE 0 END)              AS giris_miktar,
            SUM(CASE WHEN hareket_turu = 'cikis' THEN ABS(miktar) ELSE 0 END)         AS cikis_miktar,
            COUNT(*)                                                                  AS toplam_hareket
          FROM hareketler
          WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
            AND created_at <  DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
        ),
        last_month AS (
          SELECT 
            SUM(CASE WHEN hareket_turu = 'giris' THEN miktar ELSE 0 END)              AS giris_miktar,
            SUM(CASE WHEN hareket_turu = 'cikis' THEN ABS(miktar) ELSE 0 END)         AS cikis_miktar
          FROM hareketler
          WHERE created_at >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
            AND created_at <  DATE_FORMAT(CURDATE(), '%Y-%m-01')
        )
        SELECT 
          tm.giris_miktar  AS this_giris,
          lm.giris_miktar  AS last_giris,
          tm.cikis_miktar  AS this_cikis,
          lm.cikis_miktar  AS last_cikis,
          tm.toplam_hareket AS toplam_hareket
        FROM this_month tm
        CROSS JOIN last_month lm;
      `;

      const [rows] = await db.query(query);
      const row = rows[0] || {};

      const thisGiris = row.this_giris || 0;
      const lastGiris = row.last_giris || 0;
      const thisCikis = row.this_cikis || 0;
      const lastCikis = row.last_cikis || 0;
      const toplamHareket = row.toplam_hareket || 0;

      const netThis = thisGiris - thisCikis;
      const netLast = (lastGiris || 0) - (lastCikis || 0);

      const calcChange = (current, previous) => {
        if (!previous && !current) return 0;
        if (!previous && current) return 100;
        return ((current - previous) / previous) * 100;
      };

      const girisChange = calcChange(thisGiris, lastGiris);
      const cikisChange = calcChange(thisCikis, lastCikis);
      const netChange = calcChange(netThis, netLast);

      return {
        thisMonth: {
          giris: thisGiris,
          cikis: thisCikis,
          net: netThis,
          toplamHareket,
        },
        lastMonth: {
          giris: lastGiris,
          cikis: lastCikis,
          net: netLast,
        },
        changeRates: {
          giris: girisChange, // %
          cikis: cikisChange, // %
          net: netChange,
        },
      };
    } catch (err) {
      console.error("Logs.getMonthlyStats hata: ", err);
      throw err;
    }
  }
}

module.exports = Logs;
