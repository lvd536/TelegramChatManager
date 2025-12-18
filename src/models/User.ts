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
