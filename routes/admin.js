const express = require("express");
const multer = require("multer");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");
const admin = require("../controllers/adminController");

// Files are held in memory, then handed to utils/storage.js, which writes
// to public/pdf/ locally or to S3-compatible cloud storage when configured
// (see utils/storage.js — required for Vercel/serverless deployments,
// where local disk writes don't persist).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed."));
    }
    cb(null, true);
  }
});

router.use(adminAuth);

router.get("/notices", admin.list);
router.post("/notices", upload.single("attachment"), admin.create);
router.post("/notices/:id/delete", admin.remove);
router.post("/notices/:id/pin", admin.togglePin);

module.exports = router;
