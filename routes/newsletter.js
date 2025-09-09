import express from "express";
import { addSubscriber, getSubscribers } from "../controllers/newsletterController.js";

const router = express.Router();

// Routes
router.post("/", addSubscriber);
router.get("/", getSubscribers);

export default router;
