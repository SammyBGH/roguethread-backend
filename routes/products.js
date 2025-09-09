import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
const r = Router();

const file = join(process.cwd(), "data", "products.json");

r.get("/", (_req, res) => {
  try {
    const rows = JSON.parse(readFileSync(file, "utf-8"));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Could not read products." });
  }
});

r.post("/", (req, res) => {
  try {
    const rows = JSON.parse(readFileSync(file, "utf-8"));
    const newProduct = { ...req.body, sku: Date.now().toString() }; // auto SKU if not provided
    rows.push(newProduct);
    writeFileSync(file, JSON.stringify(rows, null, 2));
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Could not save product." });
  }
});


export default r;
