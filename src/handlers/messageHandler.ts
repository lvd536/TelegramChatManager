import {
    ensureUserInChat,
    incrementMessageCounters,
} from "../db/baseMethods.js";
import { db } from "../db/client.js";
import { userChats } from "../db/schema.js";
import { MyContext } from "../types.js";
import { handleVoiceMessage } from "./voiceMessageHandler.js";

export const handleMessage = async (ctx: MyContext) => {
    if (!ctx.from || !ctx.message || !ctx.chatId) {
        return;
    }
    const { id: telegramId, first_name: firstName, username } = ctx.from;
    const { userChat } = await await ensureUserInChat(
        telegramId,
        ctx.chatId,
        firstName,
        username,
        ctx.chat?.title
    );
    if (!userChat) {
        return ctx.reply(
            "Вы не зарегистрированы. Пожалуйста, введите /start для регистрации."
        );
    }
    if (ctx.message.voice || ctx.message.video_note) {
        handleVoiceMessage(ctx);
    }
    await incrementMessageCounters(ctx, userChat);
};
