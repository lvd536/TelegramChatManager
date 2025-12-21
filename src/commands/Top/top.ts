import { MyContext } from "../../types.js";
import { renderTop } from "./renderTop.js";

export const top = async (ctx: MyContext) => {
    const { text, keyboard } = await renderTop("messages", ctx);

    ctx.reply(text, {
        parse_mode: "HTML",
        reply_markup: keyboard,
    });
};
