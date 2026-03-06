"use client";

import { LogOut } from "lucide-react";
import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
          router.refresh();
        },
        onError: () => {
          setIsLoggingOut(false);
          alert("Erro ao sair da conta. Tente novamente.");
        }
      },
    });
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-3 px-8 py-4 rounded-[1.5rem] bg-destructive/10 text-destructive font-black uppercase italic tracking-widest text-sm hover:bg-destructive hover:text-destructive-foreground transition-all active:scale-95 disabled:opacity-50 hover:text-white cursor-pointer"
    >
      <span className="leading-none">{isLoggingOut ? "Saindo..." : "Sair da conta"}</span>
      <LogOut className="size-5" />
    </button>
  );
}
