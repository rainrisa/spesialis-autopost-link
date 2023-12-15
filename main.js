import { Bot, webhookCallback } from "grammy";
import express from "express";
import { cleanEnv, num, str } from "envalid";
import dotenv from "dotenv";

dotenv.config();

const env = cleanEnv(process.env, {
  BOT_TOKEN: str(),
  CHANNEL_ID: num(),
});
const server = express();
const bot = new Bot(env.BOT_TOKEN);
const port = 8080;

server.use(express.json());

server.post("/link", async (req, res) => {
  const link = req.body.link;
  if (link) {
    const message = await bot.api.sendMessage(env.CHANNEL_ID, link);
    return res.send({ message });
  }
  return res.status(500).send({ message: "Provide link" });
});
server.use(webhookCallback(bot, "express"));

server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
