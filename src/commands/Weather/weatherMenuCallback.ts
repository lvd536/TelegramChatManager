import { MyContext } from "../../types.js";
import { renderWeather } from "./renderWeather.js";

export const weatherMenuCallback = async (ctx: MyContext) => {
    if (!ctx.callbackQuery || !ctx.callbackQuery.message) return;
    const { weatherMessage, keyboard } = await renderWeather(ctx);

    ctx.callbackQuery?.message?.editText(weatherMessage, {
        parse_mode: "HTML",
        reply_markup: keyboard,
    });
    await ctx.answerCallbackQuery();
};
