export const TOP_CATEGORIES = {
    messages: "💬 Всего",
    textMessages: "✍️ Текст",
    imageMessages: "🖼 Фото",
    videoMessages: "🎥 Видео",
    audioMessages: "🎧 Аудио",
    voiceMessages: "🎤 Голос",
    videoNoteMessages: "📹 Круги",
    stickerMessages: "😀 Стикеры",
    animationMessages: "🎞 GIF",
    documentMessages: "📄 Документы",
    pollMessages: "📊 Опросы",
    geoMessages: "📍 Гео",
    otherMessages: "📦 Другое",
} as const;

export type TopCategory = keyof typeof TOP_CATEGORIES;
