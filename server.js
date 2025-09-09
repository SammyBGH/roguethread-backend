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

import ExpressError from "./utils/ExpressError.js"; // Make sure your class is exported as default

dotenv.config();
const app = express();

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------- Middlewares -------------------
app.use(express.json({ limit: "2mb" }));

// CORS: allow local dev + Vercel frontend
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL]             // Only Vercel in production
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

// ------------------- Health Check -------------------
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ------------------- API Routes -------------------
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/contact", contact);
app.use("/api/admin", admin);
app.use("/api/newsletter", newsletter);

// ------------------- Serve Frontend (production) -------------------
if (process.env.NODE_ENV === "production") {
  // Frontend is hosted separately (Vercel), no static serving needed
  console.log("⚡ Production mode: frontend is on Vercel, skipping static files");
}

// ------------------- Catch-all 404 -------------------
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// ------------------- Error Handler -------------------
app.use((err, _req, res, _next) => {
  const { statusCode = 500, message = "Internal server error" } = err;
  console.error(err.stack || err);
  res.status(statusCode).json({ error: message });
});

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
