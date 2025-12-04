import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // отключаем статическую оптимизацию

const OPENAI_BASE_URL = "https://api.openai.com/v1";

export async function POST(
  req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const { threadId } = params;

  if (!threadId) {
    return NextResponse.json(
      { error: "threadId не передан в URL" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const assistantId = process.env.OPENAI_ASSISTANT_ID;

  if (!apiKey || !assistantId) {
    return NextResponse.json(
      { error: "Нет OPENAI_API_KEY или OPENAI_ASSISTANT_ID" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { message } = body as { message?: string };

    if (!message) {
      return NextResponse.json(
        { error: "Поле message обязательно" },
        { status: 400 }
      );
    }

    // 1. Добавляем сообщение пользователя в тред
    const msgRes = await fetch(
      `${OPENAI_BASE_URL}/threads/${threadId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2",
        },
        body: JSON.stringify({
          role: "user",
          content: message,
        }),
      }
    );

    if (!msgRes.ok) {
      const err = await msgRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.error?.message || "Ошибка добавления сообщения в тред" },
        { status: msgRes.status }
      );
    }

    // 2. Запускаем run для этого треда
    const runRes = await fetch(
      `${OPENAI_BASE_URL}/threads/${threadId}/runs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2",
        },
        body: JSON.stringify({
          assistant_id: assistantId,
        }),
      }
    );

    if (!runRes.ok) {
      const err = await runRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.error?.message || "Ошибка запуска run" },
        { status: runRes.status }
      );
    }

    const run = await runRes.json();

    return NextResponse.json(
      {
        run_id: run.id,
        status: run.status,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Неизвестная ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Используйте POST для действий с тредом" },
    { status: 200 }
  );
}
