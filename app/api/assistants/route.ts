// app/api/assistants/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  // ВРЕМЕННАЯ ЗАГЛУШКА: просто отвечает статическим JSON
  return NextResponse.json(
    {
      ok: true,
      message:
        "Stub /api/assistants. Creation of assistants отключено на этом проекте.",
    },
    { status: 200 }
  );
}
