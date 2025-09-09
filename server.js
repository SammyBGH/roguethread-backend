import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import morgan from "morgan";

import products from "./routes/products.js";
import orders from "./routes/orders.js";
import contact from "./routes/contact.js";
import admin from "./routes/admin.js";
import newsletter from "./routes/newsletter.js";

dotenv.config();
const app = express();

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "2mb" }));

// CORS setup: allow local dev + Vercel frontend
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL]                     // Vercel only in production
    : ["http://localhost:5173", process.env.FRONTEND_URL]; // Dev + Vercel

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow Postman/curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`Blocked CORS request from origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    optionsSuccessStatus: 200,
  })
);

app.use(helmet());
app.use(morgan("combined"));

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// API routes
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/contact", contact);
app.use("/api/admin", admin);
app.use("/api/newsletter", newsletter);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../dressup/dist"); // Adjust to your frontend build folder
  app.use(express.static(buildPath));

  // Catch-all for client-side routing
  app.get("*", (_req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// 404 & error handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
app.use((err, _req, res, _next) => {
  console.error(err.stack || err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
