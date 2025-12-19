import { MyContext } from "../../types.js";
import { profile } from "./profile.js";

export const profileMenuCallback = async (ctx: MyContext) => {
    await ctx.answerCallbackQuery();
    
    profile(ctx);
};
