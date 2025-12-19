import { InlineKeyboard } from "grammy";
import { User } from "../../models/User.js";
import { TOP_CATEGORIES, TopCategory } from "../../constants/topCategories.js";

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

export async function renderTop(category: TopCategory) {
    const users = await User.find()
        .sort({ [category]: -1 })
        .limit(LIMIT);

    const title = TOP_CATEGORIES[category];

    const text = `
<b>🏆 Топ 10 — ${title}</b>

${users
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
