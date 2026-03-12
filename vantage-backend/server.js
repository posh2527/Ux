const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Importing the AI Service logic
const { analyzeUI } = require('./services/aiService');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Path setup for uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// 3. Main Analysis Endpoint
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    const { mode, projectType, framework, code } = req.body;
    const screenshotPath = req.file ? req.file.path : null;

    console.log(`Starting analysis for ${projectType} using ${framework} in ${mode} mode`);

    // Validation: Ensure either an image or code is provided for analysis
    if (!screenshotPath && !code) {
      return res.status(400).json({ 
        status: "error", 
        message: "Missing input: Please provide a screenshot or code for analysis." 
      });
    }

    /**
     * Calling Gemini AI Service
     * This processes the image based on Nielsen's Heuristics. [cite: 108]
     */
    const auditReport = await analyzeUI(screenshotPath, projectType, framework);

    // Final response sent back to the Dashboard
    res.json({ 
      status: "success", 
      message: "Analysis completed successfully",
      data: auditReport 
    });

    /** * Optional: Cleanup processed files to save storage
     * if (screenshotPath) fs.unlinkSync(screenshotPath);
     */

  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ 
      status: "error", 
      message: "AI Analysis failed. Please check backend logs." 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Vantage Pro Backend running on port ${PORT}`));