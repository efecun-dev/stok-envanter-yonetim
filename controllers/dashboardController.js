const Product = require("../models/Product");
const Logs = require("../models/Logs");
const Category = require("../models/Category");
const db = require("../config/database");

const formatLocalDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

exports.getDashboard = async (req, res) => {
  try {
    // Mevcut veriler
    const products = await Product.getAllProducts();
    const totalProducts = products.length;
    const totalValue = await Product.getTotalValue(); // number (envanter değeri)
    const criticalStock = await Product.getCritical();
    const todayLogs = await Logs.getLogs("today");
    const categoryStats = await Category.getCategoryStats();
    const last15Days = await Logs.getLast15DaysStockMovements();
    const critical5Stock = await Product.getCritical("top5");
    const last5Logs = await Logs.getLogs("last5");
    const topMovements = await Logs.getLogs("top6");

    // --- TOPLAM STOK ADEDİ (tüm ürünlerdeki mevcut_stok toplamı) ---
    const totalStockUnits = products.reduce(
      (sum, p) => sum + (p.mevcut_stok || 0),
      0
    );

    // --- BU AY NET HAREKETLER (adet ve değer bazlı) ---
    const [movementRows] = await db.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN h.hareket_turu = 'giris' THEN h.miktar ELSE -h.miktar END), 0) AS net_units,
        COALESCE(SUM(
          CASE WHEN h.hareket_turu = 'giris'
               THEN h.miktar * u.alis_fiyati
               ELSE -h.miktar * u.alis_fiyati
          END
        ), 0) AS net_value
      FROM hareketler h
      JOIN urunler u ON h.urun_id = u.id
      WHERE h.created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `
    );

    const netUnitsThisMonth = Number(movementRows[0]?.net_units || 0);
    const netValueThisMonth = Number(movementRows[0]?.net_value || 0);

    // --- GEÇEN AY SONUNDAKİ TAHMİNİ STOK ADEDİ & ENVANTER DEĞERİ ---
    const lastMonthStockUnits = totalStockUnits - netUnitsThisMonth;
    const lastMonthValue = Number(totalValue || 0) - netValueThisMonth;

    // --- YÜZDELİK DEĞİŞİMLER ---
    let stockChangeRate = 0;
    if (lastMonthStockUnits > 0) {
      stockChangeRate =
        ((totalStockUnits - lastMonthStockUnits) / lastMonthStockUnits) * 100;
    }

    let valueChangeRate = 0;
    if (lastMonthValue > 0) {
      valueChangeRate =
        ((Number(totalValue || 0) - lastMonthValue) / lastMonthValue) * 100;
    }

    // --- BUGÜN GİRİŞ / ÇIKIŞ ADETİ ---
    const todayGirisCount = todayLogs.filter(
      (l) => l.hareket_turu === "giris"
    ).length;
    const todayCikisCount = todayLogs.filter(
      (l) => l.hareket_turu === "cikis"
    ).length;

    // --- SON 15 GÜN GRAFİĞİ İÇİN DOLDURMA ---
    const final15Days = [];
    for (let i = 14; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const dateStr = formatLocalDate(d);

      const found = last15Days.find((x) => {
        const t =
          x.tarih instanceof Date ? formatLocalDate(x.tarih) : String(x.tarih);
        return t === dateStr;
      });

      final15Days.push({
        tarih: dateStr,
        hareket_adedi: found ? found.hareket_adedi : 0,
      });
    }

    res.render("dashboard", {
      // mevcutlar
      totalProducts, // ürün çeşidi
      totalValue: Number(totalValue || 0),
      totalCriticalStock: criticalStock.length,
      todayLogsLength: todayLogs.length,
      categoryStats,
      last15Days: final15Days,
      criticals: critical5Stock,
      last5Logs,
      topMovements,

      // yeni eklenenler
      totalStockUnits, // tüm ürünlerin toplam mevcut_stok'u
      stockChangeRate, // % değişim
      valueChangeRate, // % değişim
      lastMonthStockUnits,
      lastMonthValue,
      todayGirisCount,
      todayCikisCount,
    });
  } catch (err) {
    console.error("getDashboard hata:", err);
    res.status(500).send("Dashboard hata");
  }
};
