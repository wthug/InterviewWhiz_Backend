const { jsPDF } = require("jspdf");
const path = require("path");
const fs = require("fs");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const width = 800;
const height = 400;
const chartCanvas = new ChartJSNodeCanvas({ width, height });

const generatePDFReport = async (reportText, score, formData = {}) => {
  const {
    name = "N/A",
    role = "N/A",
    company = "N/A",
    experience = "N/A",
    prefferedLanguage = "N/A",
    codingRound = false,
  } = formData;

  const doc = new jsPDF();
  const maxWidth = 180;
  const xPos = 10;
  let yPos = 10;

  // === TITLE ===
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("Interview Summary Report", xPos, yPos);
  yPos += 12;

  // === OVERALL SCORE ===
  doc.setFont("times", "normal");
  doc.setFontSize(14);
  doc.text(`Overall Score: ${score}/10`, xPos, yPos);
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

  yPos += 4; // spacing before next section

  // === FEEDBACK SECTION ===
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("Feedback Analysis", xPos, yPos);
  yPos += 8;

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(reportText, maxWidth);
  lines.forEach((line) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 10;
    }
    doc.text(line, xPos, yPos);
    yPos += 6;
  });

  // === SCORE CHART SECTION ===
  const topicScoresSection = reportText.match(
    /Technical Topic-wise Score Data\s*([\s\S]*)/i
  );
  
  let topicScores = {};
  
  // Helper function to clean label text
  const cleanText = (text) => text.replace(/[^\x00-\x7F]/g, "").trim();
  
  if (topicScoresSection) {
    const lines = topicScoresSection[1]
      .split("\n")
      .filter((line) => line.includes(":"));
    
    lines.forEach((line) => {
      const [rawTopic, rawScore] = line.split(":");
      const topic = cleanText(rawTopic);
      const scoreVal = parseFloat(rawScore);
      if (!isNaN(scoreVal) && topic.length > 0) {
        topicScores[topic] = scoreVal;
      }
    });
  }
  
  if (Object.keys(topicScores).length > 0) {
    const labels = Object.keys(topicScores).map((label) => String(label));
    const data = Object.values(topicScores).map((val) => Number(val));
  
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
            ticks: {
              precision: 0,
            },
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
            font: {
              size: 16,
            },
          },
          legend: {
            display: true,
            position: "top",
          },
        },
      },
    });
  
    const chartBase64 = chartBuffer.toString("base64");
  
    doc.addPage();
    doc.setFont("helvetica", "bold"); // Use safer font
    doc.setFontSize(16);
    doc.text("Visual Performance Analysis", xPos, 20);
    doc.addImage(chartBase64, "PNG", xPos, 30, 180, 90);
  }  

  // === SIGNATURE SECTION ===
  doc.addPage();
  doc.setFont("times", "italic");
  doc.setFontSize(16);
  doc.text("Best Wishes for your Interview", xPos, 100);
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("– mockXpert Team", xPos, 115);

  // === SAVE PDF ===
  const pdfArrayBuffer = doc.output("arraybuffer");
  const pdfBuffer = Buffer.from(pdfArrayBuffer);
  const pdfDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);
  const fileName = `interview-report-${Date.now()}.pdf`;
  const filePath = path.join(pdfDir, fileName);
  fs.writeFileSync(filePath, pdfBuffer);
  console.log(`PDF saved to: ${filePath}`);

  return filePath;
};

module.exports = { generatePDFReport };
