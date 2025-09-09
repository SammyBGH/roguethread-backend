import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const r = Router();
const file = join(process.cwd(), "data", "messages.json");

r.post("/", (req, res) => {
  let rows = [];
  try {
    rows = JSON.parse(readFileSync(file, "utf-8"));
  } catch (err) {
    return res.status(500).json({ error: "Failed to read messages" });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const msg = {
    id: Date.now().toString(36),
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  rows.push(msg);

  try {
    writeFileSync(file, JSON.stringify(rows, null, 2));
  } catch (err) {
    return res.status(500).json({ error: "Failed to save message" });
  }

  res.status(201).json({ ok: true });
});

export default r;
