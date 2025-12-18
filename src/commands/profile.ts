import { InlineKeyboard } from "grammy";
import { User } from "../models/User.js";
import { MyContext } from "../types.js";

export const profile = async (ctx: MyContext) => {
    if (!ctx.from) {
        return ctx.reply("User info is not availbale");
    }

    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
        return ctx.reply(
            "Вы не зарегистрированы. Пожалуйста, введите /start для регистрации."
        );
    }
    try {
        const keyboard = new InlineKeyboard().text("Меню", "menu");
        const profile = `Имя: ${user.firstName}\nUsername: ${
            user.username
        }\nСообщения: ${user.messages}\nТекстовые сообщения: ${
            user.textMessages
        }\nИзображения: ${user.imageMessages}\nВидео: ${
            user.videoMessages
        }\nАудио: ${user.audioMessages}\nГеолокация: ${
            user.geoMessages
        }\nДругие сообщения: ${
            user.otherMessages
        }\nОтслеживается ботом c: ${user.createdAt.toLocaleDateString("ru-RU", {
            timeZone: "Europe/Samara",
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        })}
        `;
        return ctx.reply(profile, {
            reply_markup: keyboard,
        });
    } catch (error) {
        console.error("Ошибка при регистрации пользователя", error);
        ctx.reply("Произошла ошибка, попробуйте позже");
    }
};
