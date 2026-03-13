import { Container } from "@/components/common/container";
import {
  ShieldWarningIcon,
  SignOutIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuspendedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden selection:bg-destructive/20 selection:text-destructive">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-destructive blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary blur-[150px] rounded-full opacity-50" />
      </div>

      {/* Texture Layer */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <Container className="max-w-2xl relative z-10">
        <div className="bg-card/40 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-8 md:p-16 text-center shadow-[0_0_100px_rgba(0,0,0,0.5)] space-y-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-destructive/50 to-transparent" />

          <div className="size-32 bg-destructive/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-destructive/20 shadow-[0_0_40px_rgba(239,68,68,0.1)] group-hover:scale-110 transition-transform duration-500">
            <ShieldWarningIcon
              weight="duotone"
              className="size-16 text-destructive animate-pulse"
            />
          </div>

          <div className="space-y-6">
            <h1 className="font-anton text-5xl md:text-7xl text-foreground italic uppercase tracking-tighter leading-[0.9]">
              ACESSO <br />
              <span className="text-destructive">BLOQUEADO</span>
            </h1>

            <div className="h-px w-24 bg-destructive/30 mx-auto" />

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-medium max-w-md mx-auto">
              Sua conta foi{" "}
              <span className="text-foreground font-black italic">
                SUSPENSA
              </span>{" "}
              por tempo indeterminado devido a violações graves em nossas
              diretrizes de comunidade e termos de uso.
            </p>
          </div>

          <Button
            className="h-16 rounded-2xl bg-foreground text-background hover:bg-white transition-all font-black uppercase italic tracking-widest text-[10px] shadow-2xl w-full"
            asChild
          >
            <Link href="/auth">
              <SignOutIcon weight="duotone" className="mr-2 size-5" />
              Sair do Sistema
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
