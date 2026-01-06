const puppeteer = require("puppeteer");

exports.generatePDF = async (resumeId, token) => {
  try {
    const browser = await puppeteer.launch({
      headless: true, // ✅ REQUIRED for Render
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-dev-shm-usage", // ✅ CRITICAL for Render
      ],
    });

    const page = await browser.newPage();

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:3000";

    let cookieDomain = "localhost";
    try {
      const urlObj = new URL(frontendUrl);
      cookieDomain = urlObj.hostname;
    } catch (e) {
      console.log("Cookie domain parse error:", e);
    }

    await page.setCookie({
      name: "token",
      value: token,
      domain: cookieDomain,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    const printUrl = `${frontendUrl}/resume/print/${resumeId}`;
    console.log(`Generating PDF from: ${printUrl}`);

    await page.goto(printUrl, {
      waitUntil: "networkidle0",
    });

    await page.waitForSelector("#print-container", {
      timeout: 15000,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
      },
    });

    await browser.close();
    return pdf;
  } catch (err) {
    console.error("PUPPETEER PDF ERROR:", err);
    throw err;
  }
};
