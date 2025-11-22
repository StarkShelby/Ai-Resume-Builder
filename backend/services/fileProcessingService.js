const extract = require("pdf-extraction"); // Replaced pdf-parse
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js");
const TurndownService = require("turndown");
const textract = require("textract");

const turndownService = new TurndownService();

// Clean extracted text (primarily for OCR and final pass)
function cleanText(text) {
  return text
    .replace(/\n{3,}/g, "\n\n") // Reduce multiple newlines
    .replace(/ {2,}/g, " ") // Reduce multiple spaces
    .trim();
}

// ---- PDF Extractor (using pdf-extraction for Node.js compatibility) ----
async function extractPDFText(buffer) {
  const data = await extract(buffer);
  // pdf-extraction returns text property
  return cleanText(data.text);
}

// ---- DOCX Extractor (using mammoth to HTML then Turndown to Markdown) ----
async function extractDocxText(buffer) {
  const result = await mammoth.convertToHtml({ buffer });
  const markdown = turndownService.turndown(result.value);
  return cleanText(markdown);
}

// ---- DOC Extractor (using textract) ----
function extractDocText(buffer) {
  return new Promise((resolve, reject) => {
    textract.fromBufferWithMime("application/msword", buffer, (err, text) => {
      if (err) {
        return reject(err);
      }
      resolve(cleanText(text));
    });
  });
}

// ---- Image Extractor (OCR) ----
async function extractImageText(buffer) {
  const { data } = await Tesseract.recognize(buffer, "eng");
  return cleanText(data.text);
}

// Main function to extract text based on file type
async function extractTextFromFile(fileBuffer, mimetype) {
  if (mimetype === "application/pdf") {
    return await extractPDFText(fileBuffer);
  } else if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await extractDocxText(fileBuffer);
  } else if (mimetype === "application/msword") {
    return await extractDocText(fileBuffer);
  } else if (mimetype.startsWith("image/")) {
    return await extractImageText(fileBuffer);
  } else {
    throw new Error("Unsupported file type for text extraction.");
  }
}

module.exports = {
  extractTextFromFile,
};
