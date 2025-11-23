const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockManagementController");

router.get("/stok-durumu", stockController.getStockStatus);
router.get("/stok-girisi", stockController.getStockAdd);
router.get("/stok-cikisi", stockController.getStockRemove);
router.get("/hareketler", stockController.getStockLogs);

module.exports = router;
