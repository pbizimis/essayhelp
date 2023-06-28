import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";

interface DocumentData {
  id: string;
  title?: string;
  content?: string;
}

export const runtime = "edge";

const apiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});

const openai = new OpenAIApi(apiConfig);

export async function POST(request: Request) {
  const documentData: DocumentData = await request.json();

/*
  if (!documentData.title && documentData.content) {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create a summarizing heading for the following content: ${JSON.stringify(documentData.content)}`,
    });
    console.log("AIRESP", await response.json());
  }

 */
  const test = await db.document.findFirst();

  return NextResponse.json({"tets": "test"});
}
