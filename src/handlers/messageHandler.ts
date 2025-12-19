import { User } from "../models/User.js";
import { MyContext } from "../types.js";

export const handleMessage = async (ctx: MyContext) => {
    if (!ctx.from || !ctx.message) {
        return;
    }
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
        return ctx.reply(
            "Вы не зарегистрированы. Пожалуйста, введите /start для регистрации."
        );
    }

    if (ctx.message.photo) {
        await user.updateOne({ $inc: { messages: 1, imageMessages: 1 } });
    } else if (ctx.message.video) {
        await user.updateOne({ $inc: { messages: 1, videoMessages: 1 } });
    } else if (ctx.message.audio) {
        await user.updateOne({ $inc: { messages: 1, audioMessages: 1 } });
    } else if (ctx.message.location) {
        await user.updateOne({ $inc: { messages: 1, geoMessages: 1 } });
    } else if (ctx.message.text) {
        await user.updateOne({ $inc: { messages: 1, textMessages: 1 } });
    } else if (ctx.message.document) {
        await user.updateOne({ $inc: { messages: 1, documentMessages: 1 } });
    } else if (ctx.message.animation) {
        await user.updateOne({ $inc: { messages: 1, animationMessages: 1 } });
    } else if (ctx.message.sticker) {
        await user.updateOne({ $inc: { messages: 1, stickerMessages: 1 } });
    } else if (ctx.message.video_note) {
        await user.updateOne({ $inc: { messages: 1, videoNoteMessages: 1 } });
    } else if (ctx.message.voice) {
        await user.updateOne({ $inc: { messages: 1, voiceMessages: 1 } });
    } else if (ctx.message.poll) {
        await user.updateOne({ $inc: { messages: 1, pollMessages: 1 } });
    } else {
        await user.updateOne({ $inc: { messages: 1, otherMessages: 1 } });
    }
};
