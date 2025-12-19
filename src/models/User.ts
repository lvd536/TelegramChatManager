import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
    telegramId: number;
    firstName: string;
    username: string;
    messages: number;
    textMessages: number;
    imageMessages: number;
    videoMessages: number;
    audioMessages: number;
    geoMessages: number;
    documentMessages: number;
    animationMessages: number;
    stickerMessages: number;
    videoNoteMessages: number;
    voiceMessages: number;
    pollMessages: number;
    otherMessages: number;
    createdAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        telegramId: {
            type: Number,
            required: [true, "Telegram ID is required"],
            unique: true,
        },
        firstName: { type: String },
        username: { type: String },
        messages: {
            type: Number,
            required: [true, "messages count is required"],
        },
        textMessages: {
            type: Number,
            required: [true, "textMessages count is required"],
        },
        imageMessages: {
            type: Number,
            required: [true, "imageMessages count is required"],
        },
        videoMessages: {
            type: Number,
            required: [true, "videoMessages count is required"],
        },
        audioMessages: {
            type: Number,
            required: [true, "audioMessages count is required"],
        },
        geoMessages: {
            type: Number,
            required: [true, "geoMessages count is required"],
        },
        documentMessages: {
            type: Number,
            required: [true, "documentMessages count is required"],
        },
        animationMessages: {
            type: Number,
            required: [true, "animationMessages count is required"],
        },
        stickerMessages: {
            type: Number,
            required: [true, "stickerMessages count is required"],
        },
        videoNoteMessages: {
            type: Number,
            required: [true, "videoNoteMessages count is required"],
        },
        voiceMessages: {
            type: Number,
            required: [true, "voiceMessages count is required"],
        },
        pollMessages: {
            type: Number,
            required: [true, "pollMessages count is required"],
        },
        otherMessages: {
            type: Number,
            required: [true, "geoMessages count is required"],
        },
    },
    {
        timestamps: true,
    }
);

export const User = model<IUser>("User", userSchema);
