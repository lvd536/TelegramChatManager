import { InlineKeyboard } from "grammy";
import { TOP_CATEGORIES, TopCategory } from "../../constants/topCategories.js";
import { db } from "../../db/client.js";
import { userChats, users } from "../../db/schema.js";
import { desc } from "drizzle-orm";

const LIMIT = 10;

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

export async function renderTop(category: TopCategory) {
    const column = orderColumnMap[category];
    const topUsers = await db
        .select()
        .from(userChats)
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
