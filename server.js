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

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "2mb" }));
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests without origin (e.g., server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = [process.env.FRONTEND_URL];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(helmet());
app.use(morgan("combined"));

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// API Routes
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/contact", contact);
app.use("/api/admin", admin);
app.use("/api/newsletter", newsletter);

// Serve SPA in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "build");
  app.use(express.static(buildPath));

  // fallback to index.html for SPA routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
