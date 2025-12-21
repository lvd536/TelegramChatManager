import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    telegramId: integer("telegram_id").notNull().unique(),
    firstName: text("first_name"),
    username: text("username"),
});

export const chats = sqliteTable("chats", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    telegramId: integer("telegram_id").notNull().unique(),
    title: text("title"),
});

export const userChats = sqliteTable("user_chats", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    compound: text("compound").notNull().unique(),

    firstName: text("first_name"),
    username: text("username"),

    userId: integer("user_id").notNull(),
    chatId: integer("chat_id").notNull(),

    messages: integer("messages").notNull().default(0),
    textMessages: integer("text_messages").notNull().default(0),
    voiceMessages: integer("voice_messages").notNull().default(0),
    imageMessages: integer("image_messages").notNull().default(0),
    videoMessages: integer("video_messages").notNull().default(0),
    audioMessages: integer("audio_messages").notNull().default(0),
    geoMessages: integer("geo_messages").notNull().default(0),
    documentMessages: integer("document_messages").notNull().default(0),
    animationMessages: integer("animation_messages").notNull().default(0),
    stickerMessages: integer("stickerMessages").notNull().default(0),
    videoNoteMessages: integer("videoNote_messages").notNull().default(0),
    pollMessages: integer("poll_messages").notNull().default(0),
    otherMessages: integer("other_messages").notNull().default(0),

    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(new Date()),
});
