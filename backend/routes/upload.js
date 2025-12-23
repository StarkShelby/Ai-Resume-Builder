const express = require("express");
const multer = require("multer");
const { extractTextFromFile } = require("../services/fileProcessingService");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ---- Upload Route ----
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const text = await extractTextFromFile(file.buffer, file.mimetype);

    return res.json({ text });
  } catch (err) {
    console.error("Extraction error in /upload route:", err);
    return res.status(500).json({
      message: "Failed to extract resume text. Please ensure the file is a text-based PDF or DOCX.",
      error: err.message
    });
  }
});

module.exports = router;
