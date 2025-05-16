const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function generatePDFWithCustomCSS() {
  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  page.on("pageerror", (error) => console.log("Page error:", error.message));

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const pdfPath = path.join(outputDir, `resume-${timestamp}.pdf`);

  const targetUrl = "http://127.0.0.1:5500/index.html";
  await page.goto(targetUrl, {
    waitUntil: ["domcontentloaded", "networkidle0"],
    timeout: 30000,
  });

  const htmlContent = await page.content();

  const cssPath = path.join(__dirname, "styles_render.css");
  const cssContent = await fs.promises.readFile(cssPath, "utf8");

  const newPage = await browser.newPage();
  await newPage.setContent(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${cssContent}</style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `,
    { waitUntil: "networkidle0" }
  );

  await newPage.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    preferCSSPageSize: true,
    omitBackground: false,
  });
  console.log(`PDF saved to: ${pdfPath}`);

  await browser.close();
}

generatePDFWithCustomCSS().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
