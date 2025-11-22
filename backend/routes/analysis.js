const express = require("express");
const router = express.Router();
const { matchJD } = require("../services/analysisService");

router.post("/jd-match", async (req, res) => {
  try {
    const { resume, jobDesc } = req.body;

    const data = await matchJD(resume, jobDesc);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Job match failed" });
  }
});

module.exports = router;
