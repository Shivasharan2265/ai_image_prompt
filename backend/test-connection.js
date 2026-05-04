import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyDS9gqkubZirqr5ztHaD_93ZInWWoI6oIg');

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-image-preview" });
    const result = await model.generateContent("Say 'Connection works!'");
    console.log("✅ Success:", await result.response.text());
  } catch (error) {
    console.error("❌ Failed:", error.message);
    if (error.cause) console.error("Cause:", error.cause);
  }
}

test();