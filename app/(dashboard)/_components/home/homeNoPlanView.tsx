import { SparkleIcon, PlusIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

export function HomeNoPlanView() {
  return (
    <div className="space-y-6">
      <div className="px-5 lg:px-0 flex items-end justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-foreground tracking-tight uppercase italic leading-none">
            Comece Agora
          </h2>
          <p className="text-[10px] lg:text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1.5">
            Crie seu primeiro plano de treino com IA
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Link
          href="?chat_open=true&chat_initial_message=Monte meu plano de treino"
          className="group bg-card border border-border rounded-[2.5rem] p-10 text-center space-y-6 hover:border-primary/50 transition-all active:scale-[0.99] cursor-pointer"
        >
          <div className="size-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
            <SparkleIcon
              weight="duotone"
              className="size-10 fill-current"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-syne text-2xl font-black uppercase italic text-foreground tracking-tight">
              Fale com o Coach AI
            </h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto text-sm leading-relaxed">
              Nossa inteligência artificial está pronta para criar um
              plano de treino personalizado baseado nos seus objetivos e
              rotina.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-primary font-black uppercase italic tracking-widest text-sm">
            Iniciar conversa
            <PlusIcon weight="duotone" className="size-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
