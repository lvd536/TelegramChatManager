import { InlineKeyboard } from "grammy";
import { MyContext } from "../../types.js";
import { db } from "../../db/client.js";
import { userChats } from "../../db/schema.js";
import { and, eq } from "drizzle-orm";

export const profile = async (ctx: MyContext) => {
    if (!ctx.from || !ctx.chatId) {
        return ctx.reply("User info is not availbale");
    }

    const user = await db
        .select()
        .from(userChats)
        .where(eq(userChats.compound, `${ctx.from.id}:${ctx.chatId}`));
    if (!user[0]) {
        return ctx.reply(
            "Вы не зарегистрированы. Пожалуйста, введите /start для регистрации."
        );
    }
    try {
        const keyboard = new InlineKeyboard().text("Меню", "menu");
        const profile = `
<b>👤 Профиль пользователя</b>

<b>Имя:</b> ${user[0].firstName}
<b>Username:</b> ${user[0].username ? `@${user[0].username}` : "—"}

<b>📊 Статистика сообщений</b>
├ 💬 <b>Всего:</b> ${user[0].messages}
├ ✍️ <b>Текст:</b> ${user[0].textMessages}
├ 🖼 <b>Изображения:</b> ${user[0].imageMessages}
├ 🎥 <b>Видео:</b> ${user[0].videoMessages}
├ 🎧 <b>Аудио:</b> ${user[0].audioMessages}
├ 📍 <b>Геолокация:</b> ${user[0].geoMessages}
├ 📄 <b>Документы:</b> ${user[0].documentMessages}
├ 🎞 <b>Анимация:</b> ${user[0].animationMessages}
├ 🎨 <b>Стикеры:</b> ${user[0].stickerMessages}
├ 🎤 <b>Голосовые сообщения:</b> ${user[0].voiceMessages}
├ 🎙 <b>Кружки:</b> ${user[0].videoNoteMessages}
├ 📊 <b>Опросы:</b> ${user[0].pollMessages}
└ 📦 <b>Другое:</b> ${user[0].otherMessages}

<b>🤖 Отслеживается ботом с:</b>
<code>${user[0].createdAt.toLocaleDateString("ru-RU", {
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
