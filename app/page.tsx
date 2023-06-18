import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
    <SignInButton />
    <SignUpButton />
    </main>
  );
}
