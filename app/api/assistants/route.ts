import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/app/openai";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  try {
    const assistant = await openai.beta.assistants.create({
      instructions: "You are a helpful assistant.",
      name: "Quickstart Assistant",
      model: "gpt-4o",
      tools: [
        { type: "code_interpreter" },
        {
          type: "function",
          function: {
            name: "get_weather",
            description: "Determine weather in my location",
            parameters: {
              type: "object",
              properties: {
                location: {
                  type: "string",
                  description:
                    "The city and state e.g. San Francisco, CA",
                },
                unit: {
                  type: "string",
                  enum: ["c", "f"],
                },
              },
              required: ["location"],
            },
          },
        },
        { type: "file_search" },
      ],
    });

    return NextResponse.json({ assistantId: assistant.id }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: String(error?.message ?? error) },
      { status: 500 }
    );
  }
}
