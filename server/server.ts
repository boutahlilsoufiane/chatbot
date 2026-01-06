import express from "express";
import { connectDB, getNativeDB } from "./db.ts";

const { Request, Response } = express;

const app = express();
const PORT = 3000;

(async () => {
  await connectDB();

  app.use(express.json());

  app.get("/api/history", async (req: Request, res: Response) => {
    try {
      const db = getNativeDB();
      const rows = await db.collection("history").find().toArray();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  app.get("/api/get-answer", async (req: Request, res: Response) => {
    try {
      const db = getNativeDB();
      const rows = await db.collection("predefined_answers").find().toArray();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch the correct answer" });
    }
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
