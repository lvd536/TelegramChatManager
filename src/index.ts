import "dotenv/config";
import { Bot, GrammyError, HttpError, InlineKeyboard } from "grammy";
import { hydrate } from "@grammyjs/hydrate";
import { MyContext } from "./types.js";
import { start } from "./commands/start.js";
import { handleMessage } from "./handlers/messageHandler.js";
import { profile } from "./commands/Profile/profile.js";
import { top } from "./commands/Top/top.js";
import { topCallback } from "./commands/Top/topCallback.js";
import { topMenuCallback } from "./commands/Top/topMenuCallback.js";
import { profileMenuCallback } from "./commands/Profile/profileMenuCallback.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { weather } from "./commands/Weather/weather.js";

const BOT_API_KEY = process.env.BOT_TOKEN;
if (!BOT_API_KEY) {
    throw new Error("BOT_API_KEY is not defined");
}

if (!ffmpegPath) {
    throw new Error(
        "ffmpegPath is not defined. Please ensure ffmpeg-static is installed."
    );
}

ffmpeg.setFfmpegPath(ffmpegPath as unknown as string);

const bot = new Bot<MyContext>(BOT_API_KEY);

bot.use(hydrate());

bot.command("start", start);

bot.command("weather", weather);

bot.command("profile", profile);

bot.command("top", top);
bot.callbackQuery(/^top:/, topCallback);

bot.callbackQuery("menu", (ctx) => {
    ctx.answerCallbackQuery();

    ctx.callbackQuery.message?.editText("Вы в главном меню.\n", {
        reply_markup: new InlineKeyboard()
            .text("📊 Топ", "top")
            .text("👤 Профиль", "profile"),
    });
});

bot.callbackQuery("top", (ctx) => topMenuCallback(ctx));

bot.callbackQuery("profile", (ctx) => profileMenuCallback(ctx));

bot.on("message", handleMessage);

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

async function startBot() {
    try {
        bot.start();
        console.log("MongoDB connected & bot started");
    } catch (error) {
        console.error("Error in startBot:", error);
    }
}

startBot();
