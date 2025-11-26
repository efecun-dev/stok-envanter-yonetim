const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportController");

router.get("/", reportsController.getReports);

module.exports = router;
