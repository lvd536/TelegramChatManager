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
        const profile = `
<b>👤 Профиль пользователя</b>

<b>Имя:</b> ${user.firstName}
<b>Username:</b> ${user.username ? `@${user.username}` : "—"}

<b>📊 Статистика сообщений</b>
├ 💬 <b>Всего:</b> ${user.messages}
├ ✍️ <b>Текст:</b> ${user.textMessages}
├ 🖼 <b>Изображения:</b> ${user.imageMessages}
├ 🎥 <b>Видео:</b> ${user.videoMessages}
├ 🎧 <b>Аудио:</b> ${user.audioMessages}
├ 📍 <b>Геолокация:</b> ${user.geoMessages}
└ 📦 <b>Другое:</b> ${user.otherMessages}

<b>🤖 Отслеживается ботом с:</b>
<code>${user.createdAt.toLocaleDateString("ru-RU", {
            timeZone: "Europe/Samara",
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        })}</code>
`;

        return ctx.reply(profile, {
            reply_markup: keyboard,
            parse_mode: "HTML",
        });
    } catch (error) {
        console.error("Ошибка при регистрации пользователя", error);
        ctx.reply("Произошла ошибка, попробуйте позже");
    }
};
