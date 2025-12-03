import { NextResponse } from "next/server";
import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

// POST /api/assistants/files — загрузка файла в vector store ассистента
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    const vectorStoreId = await getOrCreateVectorStore();

    // загрузка файла в OpenAI
    const openaiFile = await openai.files.create({
      file,
      purpose: "assistants",
    });

    // привязка файла к vector store
    await openai.beta.vectorStores.files.create(vectorStoreId, {
      file_id: openaiFile.id,
    });

    return NextResponse.json(
      {
        ok: true,
        file_id: openaiFile.id,
        filename: (file as File).name,
        size: (file as File).size,
        type: (file as File).type,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("FILES POST error:", err);
    return NextResponse.json(
      {
        error: "Internal error",
        detail: String(err?.message ?? err),
      },
      { status: 500 }
    );
  }
}

// GET /api/assistants/files — список файлов vector store ассистента
export async function GET() {
  try {
    const vectorStoreId = await getOrCreateVectorStore();
    const fileList = await openai.beta.vectorStores.files.list(vectorStoreId);

    const filesArray = await Promise.all(
      fileList.data.map(async (file: any) => {
        const fileDetails = await openai.files.retrieve(file.id);
        const vectorFileDetails =
          await openai.beta.vectorStores.files.retrieve(
            vectorStoreId,
            file.id
          );

        return {
          file_id: file.id,
          filename: fileDetails.filename,
          status: vectorFileDetails.status,
        };
      })
    );

    return NextResponse.json(filesArray, { status: 200 });
  } catch (err: any) {
    console.error("FILES GET error:", err);
    return NextResponse.json(
      {
        error: "Internal error",
        detail: String(err?.message ?? err),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/assistants/files — удалить файл из vector store ассистента
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const fileId = body.fileId as string | undefined;

    if (!fileId) {
      return NextResponse.json(
        { error: "fileId is required" },
        { status: 400 }
      );
    }

    const vectorStoreId = await getOrCreateVectorStore();

    await openai.beta.vectorStores.files.del(vectorStoreId, fileId);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("FILES DELETE error:", err);
    return NextResponse.json(
      {
        error: "Internal error",
        detail: String(err?.message ?? err),
      },
      { status: 500 }
    );
  }
}

/* Helper functions */

const getOrCreateVectorStore = async (): Promise<string> => {
  const assistant = await openai.beta.assistants.retrieve(assistantId);

  const existingIds =
    assistant.tool_resources?.file_search?.vector_store_ids;

  if (existingIds && existingIds.length > 0) {
    return existingIds[0];
  }

  const vectorStore = await openai.beta.vectorStores.create({
    name: "sample-assistant-vector-store",
  });

  await openai.beta.assistants.update(assistantId, {
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStore.id],
      },
    },
  });

  return vectorStore.id;
};
