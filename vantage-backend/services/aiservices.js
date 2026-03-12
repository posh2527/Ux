const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeUI(imagePath, projectType, framework) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Read image as base64
    const imageData = fs.readFileSync(imagePath).toString("base64");

    // Cleaned up prompt without citation tags for stable JSON output
    const prompt = `Analyze this ${projectType} UI screenshot. 
    Identify UX issues based on Nielsen's Heuristics. 
    Provide response strictly in a valid JSON array format.
    Each object in the array must contain:
    - title: name of the issue
    - severity: choose from (Critical, High, Medium)
    - impact: how it affects the user
    - reason: explanation of the heuristic violation
    - codePatch: suggested fix using ${framework}
    - box: coordinates in percentage { "top": "string%", "left": "string%", "width": "string%", "height": "string%" }`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageData, mimeType: "image/png" } }
    ]);

    const responseText = result.response.text();
    
    // Safety check to remove potential markdown code blocks (```json ... ```)
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to parse AI response");
  }
}

module.exports = { analyzeUI };