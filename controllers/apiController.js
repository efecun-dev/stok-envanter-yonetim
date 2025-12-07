const Product = require("../models/Product");
const Category = require("../models/Category");

exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Ürün ID belirtilmedi." });
    }

    const data = await Product.getProduct(id);

    if (!data) {
      return res.status(404).json({ error: "Ürün bulunamadı." });
    }

    return res.json(data);
  } catch (err) {
    console.error("getProduct error:", err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const data = await Category.getAllCategories();
    if (!data) {
      req.session.alert = {
        type: "danger",
        message: "Kategori bulunamadı",
      };
    }
    return res.json(data);
  } catch (err) {
    console.error("getCategories error:", err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Category.getCategory(id);
    if (!data) {
      req.session.alert = {
        type: "danger",
        message: "Kategori bulunamadı",
      };
    }
    return res.json(data);
  } catch (err) {
    console.error("getCategory hata: ", err);
    return res.redirect("/urun-yonetimi/kategoriler");
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const q = req.query.q || "";

    if (!q) return res.json([]);

    const results = await Product.searchProducts(q);

    res.json(results);
  } catch (err) {
    console.error("Arama hatası:", err);
    res.status(500).json([]);
  }
};
