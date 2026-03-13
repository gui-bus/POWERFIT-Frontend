"use client";

import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { LightningIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";


const AuthPage = () => {

  const router = useRouter();
  const { setTheme } = useTheme();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  useEffect(() => {
    if (session?.user && !isPending) {
      router.push("/");
    }
  }, [session, isPending, router]);

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_BASE_URL,
    });
  };

  if (session && !isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground animate-pulse uppercase italic font-black tracking-tighter">
            Redirecionando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background selection:bg-primary/30 selection:text-foreground antialiased transition-colors duration-700">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 0.8,
          }}
          transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full w-full"
        >
          <Image
            src="/images/login-bg.png"
            alt="Atmosfera de Esporte de Elite"
            fill
            className="object-cover object-center contrast-[1.15] brightness-[0.85] saturate-[0.9] transition-all duration-700 rotate-y-180"
            priority
          />
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-br from-background/95 via-background/40 to-transparent transition-colors duration-1000" />
        <div className="absolute inset-0 bg-linear-to-tr from-background/80 via-transparent to-transparent opacity-60 transition-opacity duration-1000" />

        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full mix-blend-screen animate-pulse transition-all duration-1000" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 blur-[180px] rounded-full mix-blend-screen transition-all duration-1000" />

        <div className="absolute inset-0 bg-background/10 backdrop-blur-[0.3px]" />
      </div>

      <header className="relative z-20 flex w-full items-center justify-between px-8 py-10 lg:px-20 lg:py-14">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/images/powerfit-logo.svg"
            alt="POWER.FIT"
            width={160}
            height={40}
            priority
          />
        </motion.div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-start justify-center px-6 sm:px-12 lg:px-20">
        <div className="w-full max-w-7xl space-y-8 sm:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-primary"
          >
            <LightningIcon size={16} weight="fill" className="animate-pulse" />O
            Futuro da Performance
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-syne text-[clamp(2rem,11vw,1rem)] md:text-8xl font-black uppercase leading-[0.85] tracking-tighter text-foreground"
            >
              Domine seu <br />
              <span className="text-primary italic">Potencial</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="max-w-4xl text-base leading-relaxed  sm:text-xl lg:text-2xl font-light"
            >
              A plataforma definitiva para atletas que buscam a excelência.
              Monitore, evolua e conquiste o topo com inteligência de elite.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="pt-4 sm:pt-8"
          >
            <Button
              onClick={handleGoogleLogin}
              className="group relative h-16 sm:h-20 w-full max-w-md  min-w-0 sm:min-w-[320px] gap-4 overflow-hidden rounded-2xl bg-foreground px-8 sm:px-10 text-lg sm:text-xl text-background transition-all hover:bg-foreground/90 cursor-pointer"
            >
              <Image
                src="/images/google-icon.svg"
                alt="Google"
                width={28}
                height={28}
              />
              Fazer login com Google
              <ArrowRightIcon
                size={24}
                className="hidden sm:block transition-transform group-hover:translate-x-1"
              />
            </Button>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-20 w-full px-8 py-10 lg:px-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5 pt-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
            © 2026 Sistema PowerFit AI
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <span className="hover:text-primary transition-colors cursor-pointer">
              Política de Privacidade
            </span>
            <span className="hover:text-primary transition-colors cursor-pointer">
              Termos de Uso
            </span>
          </div>
        </div>
      </footer>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.1] transition-opacity duration-1000"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1.2px, transparent 1.2px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
};

export default AuthPage;
