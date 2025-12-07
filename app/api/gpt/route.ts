// app/api/gpt/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Клиент OpenAI. Ключ должен лежать в переменной окружения OPENAI_API_KEY.
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    // Проверяем, что с фронта пришёл массив messages
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { reply: "Нет сообщений" },
        { status: 400 }
      );
    }

    // Запрос к модели OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4.1", // твоя модель (можно поменять на gpt-4.1-mini при желании)
      messages,
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() ||
      "Ассистент не смог сформировать ответ.";

    return NextResponse.json({ reply: answer }, { status: 200 });
  } catch (error) {
    console.error("API /api/gpt error:", error);
    return NextResponse.json(
      { reply: "Ошибка на сервере" },
      { status: 500 }
    );
  }
}
