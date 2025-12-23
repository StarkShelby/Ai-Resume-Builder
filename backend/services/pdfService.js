const puppeteer = require("puppeteer");

exports.generatePDF = async (resumeId, token) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
      ],
    });

    const page = await browser.newPage();

    // Set the authentication cookie so the frontend can fetch data
    // Domain should ideally be localhost or the domain of the frontend
    await page.setCookie({
      name: "token",
      value: token,
      domain: "localhost", // Adjust if running in different environment
      path: "/",
    });

    // Frontend URL - assuming localhost:3000 for local dev
    // In production, this should be an environment variable
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const printUrl = `${frontendUrl}/resume/print/${resumeId}`;

    console.log(`Generating PDF from: ${printUrl}`);

    await page.goto(printUrl, {
      waitUntil: "networkidle0", // Wait until all API requests finish
    });

    // Optional: wait for a specific element to ensure rendering is done
    // await page.waitForSelector("#print-container");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0" }, // specific templates might handle margins
    });

    await browser.close();
    return pdf;
  } catch (err) {
    console.error("PUPPETEER PDF ERROR:", err);
    throw err;
  }
};
