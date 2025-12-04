// app/api/assistants/files/route.ts
import { NextRequest, NextResponse } from "next/server";

// ВАЖНО: запрещаем статическую оптимизацию, чтобы роут выполнялся только на рантайме
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // ожидаем formData с файлом и доп. полями
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Файл не передан" },
        { status: 400 }
      );
    }

    // пример: загрузка файла в OpenAI Assistants API
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY не настроен" },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await fetch("https://api.openai.com/v1/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: (() => {
        const form = new FormData();
        // @ts-ignore – Node FormData тип отличается
        form.append("file", new Blob([buffer]), file.name);
        form.append("purpose", "assistants");
        return form;
      })(),
    });

    const json = await uploadRes.json();
    if (!uploadRes.ok) {
      return NextResponse.json(
        { error: json.error?.message || "Ошибка загрузки файла в OpenAI" },
        { status: uploadRes.status }
      );
    }

    return NextResponse.json({ file_id: json.id }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Неизвестная ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Используйте POST для загрузки файлов" },
    { status: 200 }
  );
}
