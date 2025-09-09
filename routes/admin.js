import { Router } from "express";
import { readFileSync } from "fs";
import { join } from "path";

const r = Router();
const ordersFile = join(process.cwd(),"data","orders.json");
const msgsFile = join(process.cwd(),"data","messages.json");

function checkPw(req, res, next) {
  if(req.body?.password === process.env.ADMIN_PASSWORD){
    return next();
  }
  return res.status(401).json({ error: "unauthorized" });
}

r.post("/login", (req, res) => {
  if(req.body.password === process.env.ADMIN_PASSWORD){
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: "wrong password" });
  }
});

r.get("/orders", checkPw, (_req, res) => {
  try {
    const rows = JSON.parse(readFileSync(ordersFile, "utf-8"));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to read orders" });
  }
});

r.get("/messages", checkPw, (_req, res) => {
  try {
    const rows = JSON.parse(readFileSync(msgsFile, "utf-8"));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to read messages" });
  }
});

export default r;
