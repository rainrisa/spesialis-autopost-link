import { Bot, InlineKeyboard, webhookCallback } from "grammy";
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
  const button = req.body.button;
  const disablePreview = Boolean(req.body.disablePreview);
  if (link) {
    let replyMarkup;

    if (button && button.text && button.url) {
      replyMarkup = new InlineKeyboard().url(button.text, button.url);
    }
    const message = await bot.api.sendMessage(env.CHANNEL_ID, link, {
      reply_markup: replyMarkup,
      parse_mode: "MarkdownV2",
      disable_web_page_preview: disablePreview,
    });
    return res.send({ message });
  }
  return res.status(500).send({ message: "Provide link" });
});
server.use(webhookCallback(bot, "express"));

server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
