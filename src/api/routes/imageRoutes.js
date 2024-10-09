const express = require("express");
const multer = require("multer");
const { uploadCSV, getStatus } = require("../controllers/imageController");

const router = express.Router();
const upload = multer({ dest: "/src/uploads" });

router.post("/upload", upload.single("file"), uploadCSV);
router.get("/status/:requestId", getStatus);

module.exports = router;
