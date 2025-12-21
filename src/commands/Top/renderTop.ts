import { InlineKeyboard } from "grammy";
import { TOP_CATEGORIES, TopCategory } from "../../constants/topCategories.js";
import { db } from "../../db/client.js";
import { chats, userChats, users } from "../../db/schema.js";
import { desc, eq } from "drizzle-orm";
import { MyContext } from "../../types.js";

const LIMIT = 10;

export async function renderTop(category: TopCategory, ctx: MyContext) {
    const column = orderColumnMap[category];
    const chatId = await db
        .select()
        .from(chats)
        .where(eq(chats.telegramId, ctx.chatId || 1));
    const topUsers = await db
        .select()
        .from(userChats)
        .where(eq(userChats.chatId, chatId[0].id || 1))
        .orderBy(desc(column))
        .limit(LIMIT);

    const title = TOP_CATEGORIES[category];

    const text = `
<b>🏆 Топ 10 — ${title}</b>

${topUsers
    .map(
        (u, i) =>
            `<b>${i + 1}.</b> ${u.firstName || "Без имени"} — <b>${
                u[category]
            }</b>`
    )
    .join("\n")}
`;

    const buttons = Object.entries(TOP_CATEGORIES).map(([key, label]) => ({
        text: label,
        callback_data: `top:${key}`,
    }));

    const keyboard = buildKeyboardByRows(buttons, 3);

    keyboard.row().text("⬅️ Меню", "menu");

    return { text, keyboard };
}

function buildKeyboardByRows(
    buttons: { text: string; callback_data: string }[],
    perRow = 3
) {
    const keyboard = new InlineKeyboard();

    for (let i = 0; i < buttons.length; i += perRow) {
        const row = buttons.slice(i, i + perRow);
        keyboard.row(
            ...row.map((b) => InlineKeyboard.text(b.text, b.callback_data))
        );
    }

    return keyboard;
}

const orderColumnMap: Record<TopCategory, any> = {
    messages: userChats.messages,
    textMessages: userChats.textMessages,
    imageMessages: userChats.imageMessages,
    videoMessages: userChats.videoMessages,
    audioMessages: userChats.audioMessages,
    voiceMessages: userChats.voiceMessages,
    videoNoteMessages: userChats.videoNoteMessages,
    stickerMessages: userChats.stickerMessages,
    animationMessages: userChats.animationMessages,
    documentMessages: userChats.documentMessages,
    pollMessages: userChats.pollMessages,
    geoMessages: userChats.geoMessages,
    otherMessages: userChats.otherMessages,
};
