import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
const r = Router();

const file = join(process.cwd(), "data", "messages.json");

r.post("/", (req, res) => {
  const rows = JSON.parse(readFileSync(file, "utf-8"));
  const msg = { id: Date.now().toString(36), ...req.body, createdAt: new Date().toISOString() };
  rows.push(msg);
  writeFileSync(file, JSON.stringify(rows, null, 2));
  res.status(201).json({ ok: true });
});

export default r;
