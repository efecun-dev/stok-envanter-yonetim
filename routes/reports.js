const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportController");

router.get("/raporlar", reportsController.getReports);

module.exports = router;
