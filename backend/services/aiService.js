// -------------------------------------------
// AI SERVICE – CLEAN VERSION (NO JD MATCHING)
// -------------------------------------------
require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// -------------------------------------------
// 1. Detect empty / useless resume
// -------------------------------------------
function isEmptyResume(text) {
  if (!text || typeof text !== "string") return true;
  const clean = text.replace(/[^a-zA-Z0-9]/g, "").trim();
  return clean.length < 50;
}

// -------------------------------------------
// 2. Clean AI JSON output
// -------------------------------------------
function extractJSON(raw) {
  try {
    if (!raw) return null;

    let jsonString = raw.trim();

    // 1. Try to extract content within ```json ... ``` markdown
    const jsonBlockMatch = jsonString.match(/```json\s*([\s\S]*?)```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      jsonString = jsonBlockMatch[1].trim();
    } else {
      // 2. Fallback: Clean markdown fences and find first { and last }
      jsonString = jsonString.replace(/```json|```/g, "").trim();
      const start = jsonString.indexOf("{");
      const end = jsonString.lastIndexOf("}");

      if (start === -1 || end === -1 || start > end) {
        console.log(
          "JSON Parse Error: No valid JSON object found after stripping fences."
        );
        return null;
      }
      jsonString = jsonString.substring(start, end + 1);
    }

    // Ensure the extracted string is a valid JSON object string
    if (!jsonString.startsWith("{") || !jsonString.endsWith("}")) {
      console.log(
        "JSON Parse Error: Extracted string does not start/end with curly braces."
      );
      return null;
    }

    return JSON.parse(jsonString);
  } catch (err) {
    console.log("JSON Parse Error:", err);
    return null;
  }
}

// -------------------------------------------
// 3. MAIN FUNCTION — ATS CHECKER
// -------------------------------------------
async function checkResume(text) {
  try {
    // Empty / low-info resume
    if (isEmptyResume(text)) {
      return {
        score: 0,
        strengths: [],
        weaknesses: [
          "This resume contains very little or no useful information.",
          "ATS cannot evaluate an empty or nearly empty resume.",
          "Add skills, work experience, projects, and a summary section.",
        ],
        suggestions: [
          "Write a short professional summary.",
          "Add at least 5–7 skills.",
          "Add projects or experience with bullet points.",
          "Include education details.",
        ],
      };
    }

    // Build AI prompt
    const prompt = `
You are an advanced ATS (Applicant Tracking System) scoring system. Your goal is to deeply analyze the provided resume content. This content has been extracted from a resume file (PDF, DOCX, or image) and *attempts to preserve structural information using a Markdown-like format*.

Evaluate the resume based on the following criteria:
-   **Structural Integrity & Readability:** Assess if headings, lists, and paragraphs are clearly defined (as indicated by Markdown syntax). Is the overall flow logical and easy to parse for an ATS?
-   **Content Depth & Completeness:** Does each section (e.g., Summary, Experience, Education, Skills, Projects) provide adequate and relevant details?
-   **Keyword Relevance & Density:** Are industry-specific keywords and phrases present and appropriately used?
-   **Action-Oriented Language:** Are strong action verbs used to describe accomplishments?
-   **Quantifiable Achievements:** Are there measurable results for experiences and projects?
-   **Formatting & Consistency (inferred from Markdown):** Does the structure suggest good visual organization and consistency?

Return STRICT JSON ONLY, with scores from 0-100:

{
  "score": number, // Overall ATS compatibility score
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[]
}

Resume Content (Markdown-like):
"""
${text.slice(0, 15000)}
"""
`;

    // Call Groq model
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // Or a more advanced model if available and within budget for better 'full scan' inference
      temperature: 0.2, // Slightly higher temperature for more diverse suggestions
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.choices?.[0]?.message?.content || "";
    console.log("RAW AI OUTPUT:", raw);

    const parsed = extractJSON(raw);
    if (!parsed) throw new Error("Invalid JSON returned from AI");

    return parsed;
  } catch (err) {
    console.log("ATS Resume Check Error:", err);

    return {
      score: 0,
      strengths: [],
      weaknesses: ["AI failed to analyze the resume"],
      suggestions: ["Try again later"],
    };
  }
}

// -------------------------------------------
// EXPORTS
// -------------------------------------------
module.exports = { checkResume };
