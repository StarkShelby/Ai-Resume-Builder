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
    // Frontend URL - default to localhost if not set
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // Extract domain for cookie (remove protocol and port)
    // e.g., https://myapp.vercel.app -> myapp.vercel.app
    let cookieDomain = "localhost";
    try {
      const urlObj = new URL(frontendUrl);
      cookieDomain = urlObj.hostname;
    } catch (e) {
      console.log("Error parsing frontend URL for cookie domain:", e);
    }

    await page.setCookie({
      name: "token",
      value: token,
      domain: cookieDomain,
      path: "/",
    });
    const printUrl = `${frontendUrl}/resume/print/${resumeId}`;

    console.log(`Generating PDF from: ${printUrl}`);

    await page.goto(printUrl, {
      waitUntil: "networkidle0", // Wait until all API requests finish
    });

    // CRITICAL: Wait for the main resume container to ensure data is loaded/rendered
    await page.waitForSelector("#print-container", { timeout: 10000 });

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
