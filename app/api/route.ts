import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = auth();
  const postData = await request.json();
  if (!userId) return null;

  let document;

  if (postData.documentId === "neues-dokument") {
    document = await db.document.create({
      data: {
        title: postData.documentName,
        content: {},
        authorId: userId,
      },
    });
  } else {
      document = await db.document.update({
          where: {
              id: postData.documentId,
          },
          data: {
              title: postData.documentName
          }
      })
  }

  return NextResponse.json(document);
}
