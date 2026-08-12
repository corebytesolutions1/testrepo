const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");
const admin = require("../controllers/adminController");

// PDFs are saved straight into public/pdf/ so they're immediately served
// at /pdf/<filename> — same folder the tariff page + notice downloads use.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "public", "pdf")),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
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
