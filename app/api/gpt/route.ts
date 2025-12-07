// app/api/gpt/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// клиент OpenAI. Ключ берётся из переменной окружения OPENAI_API_KEY
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { reply: "Нет сообщений" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages,
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() ||
      "Ассистент не смог сформировать ответ.";

    return NextResponse.json({ reply: answer }, { status: 200 });
  } catch (error: any) {
    console.error("API /api/gpt error:", error);
    return NextResponse.json(
      {
        reply:
          "Ошибка на сервере: " +
          (error?.message || "unknown"),
      },
      { status: 500 }
    );
  }
}
