const puppeteer = require("puppeteer");

exports.generatePDF = async (html, template) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
      ],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // ❌ OLD (removed in new Puppeteer)
    // await page.waitForTimeout(500);

    // ✅ NEW SAFE DELAY
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Or wait for a specific element
    // await page.waitForSelector("#resume-content");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", bottom: "10mm" },
    });

    await browser.close();
    return pdf;
  } catch (err) {
    console.error("PUPPETEER PDF ERROR:", err);
    throw err;
  }
};
