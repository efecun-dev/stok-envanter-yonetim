const db = require("../config/database");
const fs = require("fs");
const path = require("path");

class Report {
  constructor(row) {
    this.id = row.id;
    this.ad = row.ad;
    this.sablon_turu = row.sablon_turu;
    this.format = row.format;
    this.tarih_baslangic = row.tarih_baslangic;
    this.tarih_bitis = row.tarih_bitis;
    this.filtre_ozeti = row.filtre_ozeti;
    this.filtre_json = row.filtre_json;
    this.dosya_yolu = row.dosya_yolu;
    this.boyut_bytes = row.boyut_bytes;
    this.olusturan_id = row.olusturan_id;
    this.created_at = row.created_at;
  }

  static async create(data) {
    try {
      const sql = `
        INSERT INTO raporlar
          (ad, sablon_turu, format, tarih_baslangic, tarih_bitis,
           filtre_ozeti, filtre_json, dosya_yolu, boyut_bytes, olusturan_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(sql, [
        data.ad,
        data.sablon_turu || "custom",
        data.format || "pdf",
        data.tarih_baslangic || null,
        data.tarih_bitis || null,
        data.filtre_ozeti || null,
        data.filtre_json ? JSON.stringify(data.filtre_json) : null,
        data.dosya_yolu || null,
        data.boyut_bytes || 0,
        data.olusturan_id || null,
      ]);

      return result.insertId;
    } catch (err) {
      console.error("Report.create hata:", err);
      throw err;
    }
  }

  static async getLastReports(limit = 10) {
    try {
      const [rows] = await db.query(
        `
        SELECT *
        FROM raporlar
        ORDER BY created_at DESC
        LIMIT ?
      `,
        [limit]
      );

      return rows.map((row) => new Report(row));
    } catch (err) {
      console.error("Report.getLastReports hata:", err);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM raporlar WHERE id = ? LIMIT 1`,
        [id]
      );

      if (!rows.length) return null;
      return new Report(rows[0]);
    } catch (err) {
      console.error("Report.findById hata:", err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const [[row]] = await db.query(
        "SELECT dosya_yolu FROM raporlar WHERE id = ?",
        [id]
      );
      fs.unlinkSync(path.join(__dirname, "..", row.dosya_yolu));
      const [result] = await db.query(`DELETE FROM raporlar WHERE id = ?`, [
        id,
      ]);
      return result.affectedRows > 0;
    } catch (err) {
      console.error("Report.delete hata:", err);
      throw err;
    }
  }
}

module.exports = Report;
