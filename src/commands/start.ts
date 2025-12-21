import { InlineKeyboard } from "grammy";
import { MyContext } from "../types.js";
import { ensureUserInChat } from "../db/baseMethods.js";

export const start = async (ctx: MyContext) => {
    if (!ctx.from || !ctx.chatId) {
        return ctx.reply("User info is not availbale");
    }

    const { id: telegramId, first_name: firstName, username } = ctx.from;

    try {
        const keyboard = new InlineKeyboard().text("Меню", "menu");

        await ensureUserInChat(
            telegramId,
            ctx.chatId,
            firstName,
            username,
            ctx.chat?.title
        );

        return ctx.reply("Вы зарегистрированы!", {
            reply_markup: keyboard,
        });
    } catch (error) {
        console.error("Ошибка при регистрации пользователя", error);
        ctx.reply("Произошла ошибка, попробуйте позже");
    }
};
