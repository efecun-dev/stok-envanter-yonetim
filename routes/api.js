const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/apiController");

router.get("/urunler/:id", ApiController.getProduct);
router.get("/kategoriler", ApiController.getCategories);

module.exports = router;
