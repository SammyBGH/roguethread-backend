import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import products from "./routes/products.js";
import orders from "./routes/orders.js";
import contact from "./routes/contact.js";
import admin from "./routes/admin.js";
import newsletter from "./routes/newsletter.js";

dotenv.config();
const app = express();

// ================== Middlewares ==================
app.use(express.json({ limit: "2mb" }));
app.use(helmet());
app.use(morgan("combined"));

// ================== CORS ==================
const allowedOrigins = [
  "http://localhost:5173",            // Local dev
  process.env.FRONTEND_URL            // Vercel frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow Postman/curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`Blocked CORS request from origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  optionsSuccessStatus: 200
}));

// ================== Healthcheck ==================
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ================== API Routes ==================
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/contact", contact);
app.use("/api/admin", admin);
app.use("/api/newsletter", newsletter);

// ================== 404 & Error Handling ==================
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
