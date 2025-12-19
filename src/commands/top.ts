import { InlineKeyboard } from "grammy";
import { User } from "../models/User.js";
import { MyContext } from "../types.js";

export const top = async (ctx: MyContext) => {
    if (!ctx.from) {
        return ctx.reply("User info is not availbale");
    }

    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
        return ctx.reply(
            "Вы не зарегистрированы. Пожалуйста, введите /start для регистрации."
        );
    }
    const users = await User.find().sort({ messages: -1 }).limit(10);
    try {
        const keyboard = new InlineKeyboard().text("Меню", "menu");
        const top = `
        <b>🏆 Топ 10 пользователей по количеству сообщений:</b>
        ${users.map(
            (user, index) =>
                `
                <b>${index + 1}.</b> ${user.firstName} - <b>${
                    user.messages
                }</b> сообщений
                `
        )}
        `;
        return ctx.reply(top, {
            reply_markup: keyboard,
            parse_mode: "HTML",
        });
    } catch (error) {
        console.error("Ошибка при регистрации пользователя", error);
        ctx.reply("Произошла ошибка, попробуйте позже");
    }
};
