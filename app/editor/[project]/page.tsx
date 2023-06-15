export default function Project({ params }: { params: { project: string } }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <h1 className="m-12 ">Projekt</h1>
      {params.project}
    </main>
  );
}
