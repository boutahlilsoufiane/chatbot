import express from "express";
import { connectDB, getNativeDB } from "./db.ts";

const { Request, Response } = express;

const app = express();
const PORT = 7000;

(async () => {
  await connectDB();

  app.use(express.json());

  app.get("/api/history", async (req: Request, res: Response) => {
    console.log("get request")
    try {
      const db = getNativeDB();
      const rows = await db.collection("history").find().toArray();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  app.post("/api/get-answer", async (req: Request, res: Response) => {
    try {

      const { question } = req.body;
      const db = getNativeDB();
      const rows = await db.collection("predefined_answers").find().toArray();

      const lowerMessage = question.toLowerCase();
      let botResponse = "Could you rephrase your question?";

      for (const item of rows) {
        if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
          botResponse = item.response;
          break;
        }
      }

      const questionObject = {
        message : question,
        sender : "customer"
      }

      const answerObject = {
        message : botResponse,
        sender : "bot"
      }

      await db.collection("history").insertMany([questionObject, answerObject]);

      res.json(botResponse);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch the correct answer" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();
