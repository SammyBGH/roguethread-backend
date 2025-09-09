import { Router } from "express";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const r = Router();
const file = join(process.cwd(), "data", "orders.json");

// Ensure the file exists
if (!existsSync(file)) {
  writeFileSync(file, JSON.stringify([]));
}

// POST /api/orders
r.post("/", (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Missing or invalid customer/items" });
    }

    const rows = JSON.parse(readFileSync(file, "utf-8"));

    const order = {
      id: Date.now().toString(36), // unique ID
      customer,
      items,
      createdAt: new Date().toISOString()
    };

    rows.push(order);
    writeFileSync(file, JSON.stringify(rows, null, 2));

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// GET /api/orders (all orders)
r.get("/", (_req, res) => {
  try {
    const rows = JSON.parse(readFileSync(file, "utf-8"));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read orders" });
  }
});

export default r;
