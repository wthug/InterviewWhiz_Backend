// backend/utils/pdfGenerator.js

const { jsPDF } = require("jspdf");
const path = require("path");
const fs = require("fs");

const generatePDFReport = async (reportText, score) => {
  const doc = new jsPDF();
  const maxWidth = 180;
  const xPos = 10;
  let yPos = 10;

  // Set up PDF document
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("Interview Summary Report", xPos, yPos);
  yPos += 10;

  doc.setFont("times", "normal");
  doc.setFontSize(14);
  const basicDetails = `Score: ${score}/10`;
  doc.text(doc.splitTextToSize(basicDetails, maxWidth), xPos, yPos);
  yPos += 30;

  doc.setFont("times", "bold");
  doc.text("Feedback Analysis", xPos, yPos);
  yPos += 10;

  const lines = doc.splitTextToSize(reportText, maxWidth);
  lines.forEach((line) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 10;
    }
    doc.text(line, xPos, yPos);
    yPos += 7;
  });

  // Generate PDF as ArrayBuffer
  const pdfArrayBuffer = doc.output("arraybuffer");

  // Convert ArrayBuffer to Buffer
  const pdfBuffer = Buffer.from(pdfArrayBuffer);

  // Set the directory to save the PDF
  const pdfDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
  }

  // Define the file path to save
  const fileName = `interview-report-${Date.now()}.pdf`;
  const filePath = path.join(pdfDir, fileName);

  // Save the PDF to the file system
  fs.writeFileSync(filePath, pdfBuffer);

  console.log(`PDF saved to: ${filePath}`);

  return filePath; // Send the file path so it can be uploaded to Cloudinary
};

module.exports = { generatePDFReport };
