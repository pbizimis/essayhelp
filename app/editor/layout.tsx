import Layout from "./components/sidebar";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Layout>
        <div>{children}</div>
      </Layout>
    </>
  );
}
