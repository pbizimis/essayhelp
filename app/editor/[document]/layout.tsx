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

  const documentJson = await db.document.findUnique({
    where: {
      id: documentId,
    },
  });

  console.log(documentJson);

  // load all document titles
  // laod the json of the selected one
  return (
    <>
      <Layout>
        <div>{children}</div>
      </Layout>
    </>
  );
}
