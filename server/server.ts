import express from "express";
import { connectDB, getNativeDB } from "./db.ts";


const app = express();
const PORT = 7000;

interface Answer {
  keywords: string[];
  response: string;
}

interface History {
  message: string;
  sender: string;
  date: Date;
}



(async () => {
  await connectDB();

  app.use(express.json());

  app.get("/api/history", async (req: express.Request, res: express.Response) => {
    try {
      const db = getNativeDB();
      const rows = await db.collection("history").find().toArray();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  app.post("/api/get-answer", async (req: express.Request, res: express.Response) => {
    try {

      const { question } = req.body;
      const db = getNativeDB();
      const rows = await db.collection<Answer>("predefined_answers").find().toArray();

      const lowerMessage = question.toLowerCase();
      let botResponse = "Could you rephrase your question?";

      for (const item of rows) {
        if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
          botResponse = item.response;
          break;
        }
      }

      const questionObject = {
        message: question,
        sender: "user",
        date: new Date()
      }

      const answerObject = {
        message: botResponse,
        sender: "bot",
        date: new Date()
      }

      await db.collection<History>("history").insertMany([questionObject, answerObject]);

      res.json(botResponse);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch the correct answer" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();
