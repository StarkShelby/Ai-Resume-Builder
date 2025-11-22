const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { checkResume } = require("../services/aiService");
const pdfService = require("../services/pdfService");
const { extractTextFromFile } = require("../services/fileProcessingService");
const multer = require("multer");
const path = require("path");

const upload = multer({ storage: multer.memoryStorage() });

/* ------------------ STATIC TEMPLATE IMAGES ------------------- */
router.use(
  "/templates",
  express.static(path.join(__dirname, "../../frontend/public/templates"))
);

/* ===================================================
   GET ALL RESUMES FOR LOGGED IN USER
=================================================== */
router.get("/", auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json({ success: true, data: resumes });
  } catch (err) {
    console.error("FETCH RESUMES ERROR:", err);
    return res
      .status(500)
      .json({ success: false, error: "Could not fetch resumes" });
  }
});

/* ===================================================
   GET RESUME DETAILS FOR EDITING
=================================================== */
router.get("/details/:id", auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, error: "Resume not found" });
    }

    return res.json({ success: true, data: resume });
  } catch (err) {
    console.log("Fetch Resume for Edit Error:", err);
    return res.status(500).json({
      success: false,
      error: "Could not fetch resume for editing",
    });
  }
});

/* ===================================================
   CREATE NEW RESUME
=================================================== */
router.post("/", auth, async (req, res) => {
  try {
    const { data, title, template } = req.body;

    if (!data)
      return res
        .status(400)
        .json({ success: false, error: "Resume data missing" });

    const resume = await Resume.create({
      userId: req.user._id,
      title: title || data?.personalInfo?.fullName || "Untitled Resume",
      data,
      template,
    });

    return res.status(201).json({ success: true, data: resume });
  } catch (err) {
    console.error("SAVE RESUME ERROR:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to save resume", details: err });
  }
});

/* ===================================================
   UPDATE RESUME
=================================================== */
router.put("/:id", auth, async (req, res) => {
  try {
    const { data, title, template } = req.body;

    if (!data)
      return res
        .status(400)
        .json({ success: false, error: "Resume data missing" });

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        $set: {
          data,
          title: title || "Updated Resume",
          template,
        },
      },
      { new: true }
    );

    if (!resume)
      return res
        .status(404)
        .json({ success: false, error: "Resume not found or unauthorized" });

    return res.json({ success: true, data: resume });
  } catch (err) {
    console.error("UPDATE RESUME ERROR:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update resume" });
  }
});

/* ===================================================
   DELETE RESUME
=================================================== */
router.delete("/:id", auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume)
      return res
        .status(404)
        .json({ success: false, error: "Resume not found or unauthorized" });

    return res.json({ success: true, message: "Resume deleted" });
  } catch (err) {
    console.error("DELETE RESUME ERROR:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete resume" });
  }
});

/* ===================================================
   EXPORT PDF
=================================================== */
router.get("/:id/export", auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume)
      return res
        .status(404)
        .json({ success: false, error: "Resume not found" });

    const pdf = await pdfService.generatePDF(resume.data, resume.template);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume-${resume._id}.pdf`
    );
    res.end(pdf);
  } catch (err) {
    console.error("EXPORT RESUME ERROR:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to export PDF" });
  }
});

/* ===================================================
   ATS CHECK (FILE)
=================================================== */
router.post("/check-file-for-ats", upload.single("file"), async (req, res) => {
  try {
    console.log("ATS Check File Request Received");
    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }
    console.log("File received:", req.file.originalname, req.file.mimetype, req.file.size);

    const text = await extractTextFromFile(req.file.buffer, req.file.mimetype);
    console.log("Text extracted length:", text ? text.length : 0);

    if (!text || text.length < 50) {
      console.log("Not enough text extracted");
      return res
        .status(400)
        .json({ success: false, error: "Not enough text extracted" });
    }

    console.log("Calling checkResume...");
    const result = await checkResume(text);
    console.log("checkResume result:", result ? "Success" : "Null");

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("File ATS Error:", err);
    return res.status(500).json({ success: false, error: "ATS check failed" });
  }
});

/* ===================================================
   ATS CHECK (TEXT)
=================================================== */
router.post("/check-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 50)
      return res
        .status(400)
        .json({ success: false, error: "Not enough text provided" });

    const result = await checkResume(text);
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("Text ATS Error:", err);
    return res.status(500).json({ success: false, error: "ATS check failed" });
  }
});

module.exports = router;
