const { jsPDF } = require("jspdf");
const path = require("path");
const fs = require("fs");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const width = 800;
const height = 400;
const chartCanvas = new ChartJSNodeCanvas({ width, height });

const generatePDFReport = async (reportText, scoreOverride = null, formData = {}) => {
  const {
    name = "N/A",
    role = "N/A",
    company = "N/A",
    experience = "N/A",
    prefferedLanguage = "N/A",
    codingRound = false,
  } = formData;

  // === Extract Overall Score ===
  let overallScore = scoreOverride;
  if (overallScore === null) {
    const match = reportText.match(/Overall Score\s*[:\-]?\s*(\d+(\.\d+)?)(?:\/10)?/i);
    overallScore = match ? parseFloat(match[1]) : "N/A";
  }

  // === Extract Topic-wise Scores ===
  const topicScores = {};

  const topicScoreLines = reportText
    .split("\n")
    .filter((line) => /^\s*-\s*[^:]+:\s*\d+\/10/.test(line));

  topicScoreLines.forEach((line) => {
    const [rawTopic, rawScore] = line.replace(/^\s*-\s*/, "").split(":");
    const topic = rawTopic.trim();
    const scoreVal = parseFloat(rawScore.trim().replace("/10", ""));
    if (!isNaN(scoreVal)) {
      topicScores[topic] = scoreVal;
    }
  });

  // === Setup PDF ===
  const doc = new jsPDF();
  const maxWidth = 180;
  const xPos = 10;
  let yPos = 10;

  // === TITLE ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Interview Summary Report", xPos, yPos);
  yPos += 12;

  // === OVERALL SCORE ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(`Overall Score: ${overallScore}/10`, xPos, yPos);
  yPos += 10;

  // === BASIC DETAILS ===
  const details = [
    `Candidate Name: ${name}`,
    `Role: ${role}`,
    `Company: ${company}`,
    `Experience: ${experience} year(s)`,
    `Preferred Language: ${prefferedLanguage}`,
    `Interview Type: ${codingRound ? "Technical" : "Behavioural"}`,
  ];

  doc.setFontSize(12);
  details.forEach((line) => {
    doc.text(line, xPos, yPos);
    yPos += 6;
  });

  yPos += 4;

  // === FEEDBACK SECTION ===
  doc.setFont("courier", "bold");
  doc.setFontSize(16);
  doc.text("Feedback Analysis", xPos, yPos);
  yPos += 8;

  doc.setFont("courier", "normal");
  doc.setFontSize(12);
  const feedbackLines = doc.splitTextToSize(reportText, maxWidth);
  feedbackLines.forEach((line) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 10;
    }
    doc.text(line, xPos, yPos);
    yPos += 6;
  });

  // === CHART SECTION ===
  if (Object.keys(topicScores).length > 0) {
    try {
      const labels = Object.keys(topicScores);
      const data = Object.values(topicScores);

      const chartBuffer = await chartCanvas.renderToBuffer({
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Score",
              data: data,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 10,
              ticks: { precision: 0 },
            },
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 0,
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Topic-wise Performance",
              font: { size: 16 },
            },
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });

      const chartBase64 = chartBuffer.toString("base64");

      if (chartBase64 && chartBase64.length > 0) {
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Visual Performance Analysis", xPos, 20);
        doc.addImage(chartBase64, "PNG", xPos, 30, 180, 90);
      } else {
        console.warn("⚠️ Chart base64 string is empty.");
      }
    } catch (err) {
      console.error("❌ Error generating chart image:", err);
    }
  } else {
    console.warn("⚠️ No topic scores found. Skipping chart.");
  }

  // === SIGNATURE SECTION ===
  doc.addPage();
  doc.setFont("helvetica", "italic");
  doc.setFontSize(16);
  doc.text("Best Wishes for your Interview", xPos, 100);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("– mockXpert Team", xPos, 115);

  // === SAVE PDF ===
  const arrayBuffer = doc.output("arraybuffer");
  const pdfBuffer = Buffer.from(arrayBuffer);

  const pdfDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

  const fileName = `interview-report-${Date.now()}.pdf`;
  const filePath = path.join(pdfDir, fileName);
  fs.writeFileSync(filePath, pdfBuffer);
  console.log(`✅ PDF saved to: ${filePath}`);

  return filePath;
};

module.exports = { generatePDFReport };