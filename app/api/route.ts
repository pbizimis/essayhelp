import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { JSONContent } from "@tiptap/react";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";

interface DocumentData {
  id: string;
  title?: string;
  content?: JSONContent;
}

export const runtime = "edge";

const apiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});

const openai = new OpenAIApi(apiConfig);

export async function POST(request: Request) {
  const { userId } = auth();
  const documentData: DocumentData = await request.json();

  if (!userId) return null;

  let document;

  if (documentData.id === "neues-dokument") {
    let title = documentData.title;
    if (!title && documentData.content) {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Create a summarizing heading for the following content: ${JSON.stringify(
          documentData.content
        )}`,
      });
      const answer = await response.json();
      console.log(answer);
      title = "CHANGE";
    }

    if (!title) return null; //handle error

    const createDocument = {
      authorId: userId,
      title: title,
      ...(documentData.content
        ? { content: documentData.content }
        : { content: {} }),
    };

    document = await db.document.create({
      data: createDocument,
    });
  } else {
    document = await db.document.update({
      where: {
        id: documentData.id,
        authorId: userId,
      },
      data: {
        title: documentData.title,
      },
    });
  }

  return NextResponse.json(document);
}
