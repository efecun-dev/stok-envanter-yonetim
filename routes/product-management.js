const express = require("express");
const router = express.Router();
const productManagementController = require("../controllers/productManagementController");

router.get("/urunler", productManagementController.getProducts);
router.get("/yeni-urun", productManagementController.getAddProduct);

module.exports = router;
