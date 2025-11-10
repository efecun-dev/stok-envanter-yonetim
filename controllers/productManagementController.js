exports.getProducts = (req, res) => {
  res.render("urun-yonetimi/urunler");
};

exports.getAddProduct = (req, res) => {
  res.render("urun-yonetimi/urun-ekle");
};
