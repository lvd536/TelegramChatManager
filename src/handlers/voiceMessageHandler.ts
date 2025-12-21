import { MyContext } from "../types.js";
import { exec } from "child_process";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

export const handleVoiceMessage = async (ctx: MyContext) => {
    if (
        !ctx.from ||
        !ctx.message ||
        (!ctx.message.voice && !ctx.message.video_note)
    )
        return;
    const message = await ctx.reply(
        "🔄 Идет распознавание голосового сообщения...\nЭто может занять некоторое время."
    );

    try {
        const fileId =
            ctx.message.voice?.file_id || ctx.message.video_note?.file_id;
        if (!fileId) return;
        const tgFile = await ctx.api.getFile(fileId);
        if (!tgFile.file_path) {
            return ctx.reply("❌ Не удалось получить файл");
        }

        const tempDir = path.join(process.cwd(), "temp");
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const oggPath = path.join(tempDir, `${ctx.from.id}.ogg`);
        const wavPath = path.join(tempDir, `${ctx.from.id}.wav`);

        const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${tgFile.file_path}`;
        const res = await fetch(fileUrl);
        if (!res.ok) {
            throw new Error(`Ошибка загрузки файла: ${res.status}`);
        }
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(oggPath, buffer);

        await new Promise<void>((resolve, reject) => {
            exec(
                `ffmpeg -y -i "${oggPath}" -ar 16000 -ac 1 "${wavPath}"`,
                (error) => (error ? reject(error) : resolve())
            );
        });

        const command = `"./whisper.cpp/build/bin/whisper-cli" -m "./whisper.cpp/models/ggml-base.bin" -f "${wavPath}" -l ru -nt`;

        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.error("Whisper stderr:", stderr);
                await message.editText("❌ Ошибка распознавания речи");
                return;
            }

            const text = stdout.trim();
            if (text.length === 0) {
                await message.editText("⚠️ Не удалось распознать речь");
            } else {
                await message.editText(`📝 Распознанный текст:\n\n${text}`);
            }

            try {
                fs.unlinkSync(oggPath);
                fs.unlinkSync(wavPath);
            } catch {}
        });
    } catch (err) {
        console.error(err);
        await message.editText("❌ Ошибка обработки сообщения");
    }
};
