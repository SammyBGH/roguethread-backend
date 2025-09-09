import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the JSON file
const emailFilePath = path.join(__dirname, "..", "data", "newsEmail.json");

// Ensure the file exists
if (!fs.existsSync(emailFilePath)) {
  fs.writeFileSync(emailFilePath, JSON.stringify([]));
}

// 📩 Add a new subscriber
export const addSubscriber = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const emails = JSON.parse(fs.readFileSync(emailFilePath, "utf8"));

    if (emails.includes(email)) {
      return res.json({ message: "You are already subscribed!" });
    }

    emails.push(email);
    fs.writeFileSync(emailFilePath, JSON.stringify(emails, null, 2));

    res.json({ message: "Thanks for subscribing!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving email" });
  }
};

// 📜 Get all subscribers
export const getSubscribers = (_req, res) => {
  try {
    const emails = JSON.parse(fs.readFileSync(emailFilePath, "utf8"));
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: "Error reading emails" });
  }
};
