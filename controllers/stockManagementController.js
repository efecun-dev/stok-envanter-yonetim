const Product = require("../models/Product");
const Category = require("../models/Category");
const Logs = require("../models/Logs");

exports.getStockStatus = async (req, res) => {
  const { category, sort } = req.query;

  // 1) KARTLAR İÇİN GLOBAL VERİLER (FİLTREDEN BAĞIMSIZ)
  const criticalAll = await Product.getLowest(); // tüm kritik ürünler
  const lowAll = await Product.getLow(); // tüm düşük stok
  const normalAll = await Product.getNormal(); // tüm normal stok
  const totalValueAll = await Product.getTotalValue(); // tüm stok değeri
  const totalProduct = await Product.getAllProducts();

  // 2) TAB / LİSTE İÇİN FİLTRELİ VERİLER
  const products = await Product.getFiltered({
    category: category || null,
    sort: sort || "default",
  });

  const criticalFiltered = products.filter(
    (item) => item.mevcut_stok <= item.min_stok / 2
  );
  const lowFiltered = products.filter(
    (item) =>
      item.mevcut_stok > item.min_stok / 2 && item.mevcut_stok <= item.min_stok
  );
  const normalFiltered = products.filter(
    (item) => item.mevcut_stok > item.min_stok
  );

  const categories = await Category.getAllCategories();
  const productIds = products.map((item) => item.id);
  const lastEntries = await Logs.getLastEntriesForProducts(productIds);

  res.render("stok-islemleri/stok-durumu", {
    // KARTLAR (GLOBAL)
    criticalCount: criticalAll.length,
    lowCount: lowAll.length,
    normalCount: normalAll.length,
    totalValue: totalValueAll,
    totalProduct: totalProduct.length,

    // TAB / LİSTE (FİLTRELİ)
    products,
    critical: criticalFiltered,
    low: lowFiltered,
    normal: normalFiltered,

    categories,
    lastEntries,
    filters: {
      category: category || "",
      sort: sort || "default",
    },
  });
};

exports.getStockStatusAjax = async (req, res) => {
  try {
    const { tab = "1", q = "" } = req.query;
    const search = q.trim().toLowerCase();

    // Eldeki metotları kullan
    const criticalAll = await Product.getLowest();
    const lowAll = await Product.getLow();
    const normalAll = await Product.getNormal();
    const allProducts = await Product.getAllProducts();
    const categories = await Category.getAllCategories();

    let baseList = [];

    if (tab === "1") baseList = allProducts;
    if (tab === "2") baseList = criticalAll;
    if (tab === "3") baseList = lowAll;
    if (tab === "4") baseList = normalAll;

    // Search filtresi (ürün adı + sku) – gerekirse genişletirsin
    const filtered = search
      ? baseList.filter((item) => {
          const name = String(item.urun_adi || "").toLowerCase();
          const sku = String(item.sku || "").toLowerCase();
          return name.includes(search) || sku.includes(search);
        })
      : baseList;

    const productIds = filtered.map((item) => item.id);
    const lastEntries = await Logs.getLastEntriesForProducts(productIds);

    // Partial render edeceğiz
    res.render(
      "stok-islemleri/partials/stok-durumu-list",
      {
        items: filtered,
        categories,
        lastEntries,
      },
      (err, html) => {
        if (err) {
          console.error("getStockStatusAjax render error:", err);
          return res.status(500).json({ error: "Render hatası" });
        }
        res.json({ html });
      }
    );
  } catch (err) {
    console.error("getStockStatusAjax hata:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.postStockStatAdd = async (req, res) => {
  const { stok_ekle } = req.body;
  const id = req.params.id;
  const result = await Product.addStock(id, stok_ekle);
  if (result) {
    req.session.alert = {
      type: "success",
      message: "Stok girişi işlemi başarılı",
    };
  } else {
    req.session.alert = {
      type: "danger",
      message: "Stok girişi işlemi başarısız",
    };
  }
  res.redirect("/stok-islemleri/stok-durumu");
};

exports.postStockStatDecrease = async (req, res) => {
  const { stok_cikar } = req.body;
  const id = req.params.id;
  const result = await Product.decreaseStock(id, stok_cikar);
  if (result) {
    req.session.alert = {
      type: "success",
      message: "Stok çıkışı işlemi başarılı",
    };
  } else {
    req.session.alert = {
      type: "danger",
      message: "Stok çıkışı işlemi başarısız",
    };
  }
  res.redirect("/stok-islemleri/stok-durumu");
};

exports.getStockAdd = (req, res) => {
  res.render("stok-islemleri/stok-girisi");
};

exports.postStockAdd = async (req, res, next) => {
  try {
    const { products, waybill, description } = req.body;
    const userId = req.user.id;

    let productIds = products || [];
    if (!Array.isArray(productIds)) {
      productIds = [productIds];
    }

    if (productIds.length === 0) {
      return res.redirect("/stok-islemleri/stok-girisi");
    }

    for (const productId of productIds) {
      const qtyRaw = req.body[`giris_miktari_${productId}`];
      const quantity = parseInt(qtyRaw, 10) || 0;

      if (!quantity || quantity <= 0) continue;

      await Product.addStock(productId, quantity);
      await Logs.addLog(
        productId,
        "giris",
        waybill,
        quantity,
        description,
        userId
      );
    }

    req.session.alert = {
      type: "success",
      message: "Stok girişi işlemi başarılı.",
    };
    res.redirect("/stok-islemleri/stok-girisi");
  } catch (err) {
    console.error("postStockAdd hata:", err);
    next(err);
  }
};

exports.getStockRemove = (req, res) => {
  res.render("stok-islemleri/stok-cikisi");
};

exports.postStockOut = async (req, res, next) => {
  try {
    const { products, waybill, description, old_stock } = req.body;
    const userId = req.user.id;
    if (!products) {
      return res.redirect("/stok-islemleri/stok-cikisi");
    }

    let productIds = products;
    if (!Array.isArray(productIds)) {
      productIds = [productIds];
    }

    for (const productId of productIds) {
      const qtyRaw = req.body[`cikis_miktari_${productId}`];
      const quantity = parseInt(qtyRaw, 10) || 0;

      if (!quantity || quantity <= 0) continue;

      await Product.decreaseStock(productId, quantity);

      await Logs.addLog(
        productId,
        "cikis",
        waybill || null,
        old_stock,
        quantity,
        description || "",
        userId
      );
    }

    res.redirect("/stok-islemleri/stok-cikisi");
  } catch (err) {
    console.error("postStockOut hata:", err);
    next(err);
  }
};

exports.getStockLogs = async (req, res, next) => {
  try {
    const { type, category, last, search, ajax } = req.query;

    const filters = {
      type: type === "giris" || type === "cikis" ? type : null,
      category:
        category && category !== "all" && !isNaN(category)
          ? Number(category)
          : null,
      last: last || null,
      search: search || null,
    };

    // 1) Liste için (type dahil)
    const logs = await Logs.getLogs(filters);

    // 2) Sayaçlar için (type hariç)
    const baseFilters = { ...filters, type: null };
    const baseLogs = await Logs.getLogs(baseFilters);

    const counts = {
      totalLog: baseLogs.length,
      totalGiris: baseLogs.filter((l) => l.hareket_turu === "giris").length,
      totalCikis: baseLogs.filter((l) => l.hareket_turu === "cikis").length,
    };

    const stats = await Logs.getMonthlyStats();

    if (ajax === "1") {
      return res.json({
        logs,
        stats,
        counts,
        type: filters.type || null,
      });
    }

    const categories = await Category.getAllCategories();

    res.render("stok-islemleri/stok-hareketleri", {
      logs,
      categories,
      stats,
      filters,
      counts,
      type: filters.type || null,
    });
  } catch (err) {
    next(err);
  }
};
