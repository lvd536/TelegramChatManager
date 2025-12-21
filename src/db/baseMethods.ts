import { db } from "./client.js";
import { users, chats, userChats } from "./schema.js";
import { and, eq, sql } from "drizzle-orm";

export async function ensureUserInChat(
    telegramId: number,
    chatTelegramId: number,
    firstName?: string,
    username?: string,
    chatTitle?: string
) {
    const compound = `${telegramId}:${chatTelegramId}`;
    const insertedUser = await db
        .insert(users)
        .values({
            telegramId,
            firstName: firstName || null,
            username: username || null,
        })
        .onConflictDoUpdate({
            target: users.telegramId,
            set: {
                firstName: firstName || null,
                username: username || null,
            },
        })
        .returning({
            id: users.id,
            telegramId: users.telegramId,
        })
        .then((results) => results[0]);

    const insertedChat = await db
        .insert(chats)
        .values({
            telegramId: chatTelegramId,
            title: chatTitle || null,
        })
        .onConflictDoUpdate({
            target: chats.telegramId,
            set: {
                title: chatTitle || null,
            },
        })
        .returning({
            id: chats.id,
            telegramId: chats.telegramId,
        })
        .then((results) => results[0]);

    const userChat = await db
        .insert(userChats)
        .values({
            firstName: firstName || null,
            username: username || null,
            compound,
            userId: insertedUser.id,
            chatId: insertedChat.id,
            messages: 0,
            textMessages: 0,
            voiceMessages: 0,
            geoMessages: 0,
            imageMessages: 0,
            videoMessages: 0,
            audioMessages: 0,
            stickerMessages: 0,
            animationMessages: 0,
            documentMessages: 0,
            pollMessages: 0,
            videoNoteMessages: 0,
            otherMessages: 0,
            createdAt: new Date(),
        })
        .onConflictDoUpdate({
            target: userChats.compound,
            set: {
                messages: sql`${userChats.messages}`,
            },
        })
        .returning({
            id: userChats.id,
            firstName: userChats.firstName,
            username: userChats.username,
            userId: userChats.userId,
            chatId: userChats.chatId,
            messages: userChats.messages,
            textMessages: userChats.textMessages,
            voiceMessages: userChats.voiceMessages,
            geoMessages: userChats.geoMessages,
            imageMessages: userChats.imageMessages,
            videoMessages: userChats.videoMessages,
            audioMessages: userChats.audioMessages,
            stickerMessages: userChats.stickerMessages,
            animationMessages: userChats.animationMessages,
            documentMessages: userChats.documentMessages,
            pollMessages: userChats.pollMessages,
            videoNoteMessages: userChats.videoNoteMessages,
            otherMessages: userChats.otherMessages,
            createdAt: userChats.createdAt,
        })
        .then((results) => results[0]);

    return { user: insertedUser, chat: insertedChat, userChat };
}

const messageTypeMap: {
    test: (msg: any) => boolean;
    field: keyof typeof userChats;
}[] = [
    { test: (m) => !!m.photo, field: "imageMessages" },
    { test: (m) => !!m.video, field: "videoMessages" },
    { test: (m) => !!m.audio, field: "audioMessages" },
    { test: (m) => !!m.location, field: "geoMessages" },
    { test: (m) => !!m.text, field: "textMessages" },
    { test: (m) => !!m.document, field: "documentMessages" },
    { test: (m) => !!m.animation, field: "animationMessages" },
    { test: (m) => !!m.sticker, field: "stickerMessages" },
    { test: (m) => !!m.video_note, field: "videoNoteMessages" },
    { test: (m) => !!m.voice, field: "voiceMessages" },
    { test: (m) => !!m.poll, field: "pollMessages" },
];

export async function incrementMessageCounters(ctx: any, userChat: any) {
    const updateData: Record<string, any> = {
        messages: sql`${userChats.messages} + 1`,
    };

    const entry = messageTypeMap.find(({ test }) => test(ctx.message));

    if (entry) {
        updateData[entry.field] = sql`${(userChats as any)[entry.field]} + 1`;
    } else {
        updateData["otherMessages"] = sql`${userChats.otherMessages} + 1`;
    }

    await db
        .update(userChats)
        .set(updateData)
        .where(eq(userChats.compound, `${ctx.from.id}:${ctx.chatId}`));
}
