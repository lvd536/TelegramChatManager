import { InlineKeyboard } from "grammy";
import { MyContext, WeatherApiResponse } from "../../types.js";
import { db } from "../../db/client.js";
import { userChats } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export const weather = async (ctx: MyContext) => {
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
        const weather: WeatherApiResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${process.env.WEATHER_CITY}&appid=${process.env.WEATHER_API_KEY}&lang=ru&units=metric`
        ).then((resp) => resp.json());

        const keyboard = new InlineKeyboard().text("Меню", "menu");

        const weatherMessage = `<b>🌤️ Погода в ${
            process.env.WEATHER_CITY
        }</b>\n<b>🌍 Облачность:</b> ${
            weather.weather[0].description
        }\n<b>🌡️ Температура:</b> ${
            weather.main.temp
        }°C\n<b>💧 Влажность:</b> ${
            weather.main.humidity
        }%\n<b>🌬️ Скорость ветра:</b> ${
            weather.wind?.speed
        } м/с\n<b>🌅 Восход:</b> ${new Date(
            weather.sys.sunrise * 1000
        ).toLocaleDateString("ru-RU", {
            timeZone: "Europe/Samara",
            hour: "2-digit",
            minute: "2-digit",
        })}\n<b>🌇 Закат:</b> ${new Date(
            weather.sys.sunset * 1000
        ).toLocaleDateString("ru-RU", {
            timeZone: "Europe/Samara",
            hour: "2-digit",
            minute: "2-digit",
        })}
        `;

        return ctx.reply(weatherMessage, {
            reply_markup: keyboard,
            parse_mode: "HTML",
        });
    } catch (error) {
        console.error("Ошибка при регистрации пользователя", error);
        ctx.reply("Произошла ошибка, попробуйте позже");
    }
};
