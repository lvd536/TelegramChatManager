import { MyContext } from "../../types.js";
import { renderTop } from "./renderTop.js";

export const topMenuCallback = async (ctx: MyContext) => {
    await ctx.answerCallbackQuery();
    
    const { text, keyboard } = await renderTop("messages", ctx);

    await ctx.callbackQuery?.message?.editText(text, {
        parse_mode: "HTML",
        reply_markup: keyboard,
    });
};
