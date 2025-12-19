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
        telegramId: { type: Number, required: true, unique: true },

        firstName: String,
        username: String,

        messages: { type: Number, default: 0 },
        textMessages: { type: Number, default: 0 },
        imageMessages: { type: Number, default: 0 },
        videoMessages: { type: Number, default: 0 },
        audioMessages: { type: Number, default: 0 },
        geoMessages: { type: Number, default: 0 },

        documentMessages: { type: Number, default: 0 },
        animationMessages: { type: Number, default: 0 },
        stickerMessages: { type: Number, default: 0 },
        videoNoteMessages: { type: Number, default: 0 },
        voiceMessages: { type: Number, default: 0 },
        pollMessages: { type: Number, default: 0 },
        otherMessages: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
