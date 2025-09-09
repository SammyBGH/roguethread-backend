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

// ================== Globals ==================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== Middlewares ==================
app.use(express.json({ limit: "2mb" })); // increased just in case
app.use(cors({ origin: "http://localhost:5173" })); // adjust as needed

// ================== Healthcheck ==================
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ================== API Routes ==================
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/contact", contact);
app.use("/api/admin", admin);
app.use("/api/newsletter", newsletter);

// ================== Optional: serve frontend ==================
// Uncomment if you build your React app into 'dist' or 'build' folder
// app.use(express.static(path.join(__dirname, "dist")));
// app.get("*", (_req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// ================== Error handling ==================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// ================== Start Server ==================
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
