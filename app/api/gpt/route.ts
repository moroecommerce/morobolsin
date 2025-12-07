// app/api/gpt/route.ts
import { NextRequest, NextResponse } from "next/server";
// импорт клиента OpenAI / Perplexity и т.п.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // важно: именно await req.json()
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { reply: "Нет сообщений" },
        { status: 400 }
      );
    }

    // здесь вызываешь свою модель
    // const answer = await client.chat(...messages...)

    const answer = "Тестовый ответ ассистента"; // временно, для проверки

    return NextResponse.json({ reply: answer }, { status: 200 });
  } catch (error) {
    console.error("API /api/gpt error:", error);
    return NextResponse.json(
      { reply: "Ошибка на сервере" },
      { status: 500 }
    );
  }
}
