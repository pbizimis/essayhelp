import TipTapEditor from "../components/editor/editor";

export default function DocumentView({
  params,
}: {
  params: { document: string };
}) {
    return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <TipTapEditor document={params.document} />
    </main>
    );
}
