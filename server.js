import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import products from "./routes/products.js";
import orders from "./routes/orders.js";
import contact from "./routes/contact.js";
import admin from "./routes/admin.js";
import newsletter from "./routes/newsletter.js";

dotenv.config();
const app = express();

// ================== Fix __dirname in ESM ==================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== Middleware ==================
app.use(express.json({ limit: "2mb" }));

// CORS: allow localhost (dev) + Vercel frontend (prod)
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL] // Only Vercel in production
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== Healthcheck ==================
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ================== API Routes ==================
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/contact", contact);
app.use("/api/admin", admin);
app.use("/api/newsletter", newsletter);

// ================== Serve Frontend (production) ==================
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../dressup/dist"); // adjust to your frontend build folder
  app.use(express.static(buildPath));

  // Catch-all for client-side routing
  app.get("*", (_req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// ================== Error Handling ==================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack || err);
  res.status(500).json({ error: "Internal server error" });
});

// ================== Start Server ==================
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
