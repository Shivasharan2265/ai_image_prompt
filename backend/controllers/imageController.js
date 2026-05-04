import { processWithGemini } from "../services/geminiService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..'); // Go up from controllers folder

// Create temp directory in the project root (not inside controllers)
const TEMP_DIR = path.join(PROJECT_ROOT, 'temp_images');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
  console.log(`Created temp directory at: ${TEMP_DIR}`);
}

// Cleanup old temp files every hour
setInterval(() => {
  const now = Date.now();
  fs.readdir(TEMP_DIR, (err, files) => {
    if (err) return;
    files.forEach(file => {
      const filePath = path.join(TEMP_DIR, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        // Delete files older than 1 hour
        if (now - stats.mtimeMs > 3600000) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned up: ${file}`);
        }
      });
    });
  });
}, 3600000);

export const processImages = async (req, res) => {
  console.log("--- Request Received ---");
  try {
    const { prompt } = req.body;
    const files = req.files;
    const results = [];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    for (const file of files) {
      console.log(`Working on: ${file.filename}`);
      
      const apiResult = await processWithGemini(file.path, prompt);
      
      // Cleanup uploaded file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      if (apiResult && apiResult.length > 500) {
        // Save base64 as temporary file
        const tempFilename = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const tempPath = path.join(TEMP_DIR, tempFilename);
        
        // Convert base64 to buffer and save
        const imageBuffer = Buffer.from(apiResult, 'base64');
        fs.writeFileSync(tempPath, imageBuffer);
        
        // Return URL instead of base64
        const imageUrl = `https://ai-image-prompt-1.onrender.com/${tempFilename}`;
        
        results.push({
          type: "image",
          url: imageUrl,
          filename: tempFilename
        });
      } else {
        results.push({
          type: "text",
          data: apiResult || "Model produced no output."
        });
      }
    }

    console.log("Batch complete. Sending to Frontend.");
    res.status(200).json({ results });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ error: "Processing failed. Check server logs." });
  }
};