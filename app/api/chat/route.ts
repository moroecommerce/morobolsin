import { NextRequest } from "next/server";
import OpenAI from "openai";

// Ваш assistant_id:
const assistant_id = "asst_O0ENHkHsICvLEjBXleQpyqDx";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Создать thread
    const thread = await openai.beta.threads.create();

    // Добавить последнее сообщение пользователя
    const userText = messages.at(-1)?.text;
    if (!userText) throw new Error("User message cannot be empty.");
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userText,
    });

    // Запустить ассистента
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id,
    });

    // Ждать завершения работы ассистента (polling)
    let status = run.status;
    let run_id = run.id;
    while (status !== "completed" && status !== "failed" && status !== "cancelled") {
      await new Promise((res) => setTimeout(res, 1500));
      const updatedRun = await openai.beta.threads.runs.retrieve(thread.id, run_id);
      status = updatedRun.status;
    }

    // Собрать все текстовые блоки из ответа ассистента
    const threadMessages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = threadMessages.data.find((msg: any) => msg.role === "assistant");
    let assistantMsg = "";
    if (assistantMessage) {
      assistantMsg = assistantMessage.content
        .filter((block: any) => block.type === "text" && block.text?.value)
        .map((block: any) => block.text.value)
        .join("\n");
    }

    return new Response(JSON.stringify({ reply: assistantMsg }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    // Показываем текст ошибки для диагностики
    console.error(error);
    return new Response(JSON.stringify({ error: String(error?.message ?? error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
