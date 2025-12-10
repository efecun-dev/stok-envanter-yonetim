const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportController");

router.get("/", reportsController.getReportsPage);
router.post(
  "/raporlar/olustur",
  reportsController.postCreateReportFromTemplate
);
router.get("/sil/:id", reportsController.getDeleteReport);

module.exports = router;
