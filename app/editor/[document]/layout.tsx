import { auth } from "@clerk/nextjs";
import Layout from "../components/sidebar";
import { db } from "@/lib/prisma";

export default async function EditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { document: string };
}) {
  const { userId } = auth();
  const documentId = params.document;

  if (!userId) return console.log("USER NOT LOGGED IN"); // add loading

  const allDocuments = await db.document.findMany({
    where: {
      authorId: userId,
    },
    select: {
      id: true,
      title: true,
    },
  });

  const selectedDocument = await db.document.findUnique({
    where: {
      id: documentId,
      authorId: userId,
    },
  });

  console.log("all docs", allDocuments);
  console.log("sel doc", selectedDocument);

  return (
    <>
      <Layout allDocumentTitles={allDocuments} currentDocumentId={documentId}>
        <div>{children}</div>
      </Layout>
    </>
  );
}
