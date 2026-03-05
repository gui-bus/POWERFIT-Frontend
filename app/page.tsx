"use client";

import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!session && !isPending) {
      router.push("/auth");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="flex w-full max-w-3xl flex-col items-center gap-12 bg-white dark:bg-zinc-900 p-12 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={24}
          priority
        />

        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Bem-vindo ao POWER.FIT
          </h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            Você está logado como{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              {session.user.name}
            </span>
          </p>
        </div>

        <button
          onClick={async () => {
            await authClient.signOut();
            router.push("/auth");
          }}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-medium transition-opacity hover:opacity-80 active:scale-95"
        >
          Sair
        </button>
      </main>
    </div>
  );
}
