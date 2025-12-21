import { MyContext } from "../../types.js";
import { TOP_CATEGORIES } from "../../constants/topCategories.js";
import { renderTop } from "./renderTop.js";

export const topCallback = async (ctx: MyContext) => {
    const data = ctx.callbackQuery?.data;
    if (!data) return;

    await ctx.answerCallbackQuery();

    const [, category] = data.split(":");

    if (!(category in TOP_CATEGORIES)) {
        return ctx.answerCallbackQuery("Неизвестная категория");
    }

    const { text, keyboard } = await renderTop(category as any, ctx);

    await ctx.callbackQuery?.message?.editText(text, {
        parse_mode: "HTML",
        reply_markup: keyboard,
    });
};
