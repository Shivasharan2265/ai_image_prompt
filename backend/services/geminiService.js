import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI('AIzaSyDS9gqkubZirqr5ztHaD_93ZInWWoI6oIg');

export const processWithGemini = async (filePath, prompt) => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.1-flash-image-preview",
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
    }
  });

  try {
    const imageBuffer = fs.readFileSync(filePath);
    
    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = result.response;
    
    // Check for blocking
    if (response.promptFeedback?.blockReason) {
      console.error("Safety Block:", response.promptFeedback.blockReason);
      return `Blocked: ${response.promptFeedback.blockReason}`;
    }

    // Find image in response
    const imagePart = response.candidates[0]?.content?.parts?.find(p => p.inlineData);
    
    if (imagePart?.inlineData?.data) {
      console.log("Success: Image generated.");
      return imagePart.inlineData.data;
    }
    
    // Fallback to text response
    return response.text();
    
  } catch (error) {
    console.error("Error details:", error);
    if (error.message.includes("429")) {
      console.error("Rate limit exceeded - waiting before retry");
      await new Promise(resolve => setTimeout(resolve, 5000));
      return processWithGemini(filePath, prompt); // Retry once
    }
    throw error;
  }
};