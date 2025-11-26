const Product = require("../models/Product");

exports.getDashboard = async (req, res) => {
  var totalProducts = await Product.getAllProducts();
  var totalValue = await Product.getTotalValue();
  var criticalStock = await Product.getCritical();

  res.render("dashboard", {
    totalProducts: totalProducts.length,
    totalValue,
    totalCriticalStock: criticalStock.length,
  });
};
