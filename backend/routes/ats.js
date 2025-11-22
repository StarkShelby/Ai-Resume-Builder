const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/score", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Missing resume or job description" });
    }

    const prompt = `
You are an ATS (Applicant Tracking System). Evaluate the resume based on the job description.
Return output in ONLY JSON format.

JSON format:
{
  "ats_score": number(0-100),
  "skills_match": number(0-100),
  "experience_match": number(0-100),
  "missing_keywords": [],
  "strengths": [],
  "weaknesses": [],
  "formatting_issues": [],
  "suggestions": []
}

Resume:
${resumeText}

Job Description:
${jobDescription}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const result = completion.choices[0].message.content;

    res.json(JSON.parse(result));

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "ATS evaluation failed",
      error: error.message,
    });
  }
});

module.exports = router;
