import { MyContext } from "../../types.js";
import { renderWeather } from "./renderWeather.js";

export const weather = async (ctx: MyContext) => {
    const { weatherMessage, keyboard } = await renderWeather(ctx);

    ctx.reply(weatherMessage, {
        parse_mode: "HTML",
        reply_markup: keyboard,
    });
};
