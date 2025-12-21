import { Context } from "grammy";
import { HydrateFlavor } from "@grammyjs/hydrate";

export type MyContext = HydrateFlavor<Context>;

export type WeatherApiResponse = {
    weather: [
        {
            id: number;
            main: string;
            description: string;
        }
    ];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level: number;
        grnd_level: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    clouds: {
        all: number;
    };
    sys: { country: string; sunrise: number; sunset: number };
    name: string;
};
