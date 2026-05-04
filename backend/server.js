import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import imageRoutes from "./routes/imageRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/images", imageRoutes);

// Serve temporary images
app.use('/temp_images', express.static(path.join(__dirname, 'temp_images')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Gemini Processor running on port ${PORT}`);
});