import { getPersonalRecords, getPersonalRecordsResponseSuccess } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { UpsertPersonalRecordDialog } from "@/components/profile/upsertPersonalRecordDialog";
import { TrophyIcon, BarbellIcon, CalendarIcon, TrendUpIcon, CaretLeftIcon } from "@phosphor-icons/react/ssr";
import dayjs from "dayjs";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function PersonalRecordsPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const response = await getPersonalRecords();

  if (response.status !== 200) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-[2.5rem]">
          <p className="text-muted-foreground font-medium italic uppercase tracking-tighter">
            Erro ao carregar galeria de recordes.
          </p>
        </div>
      </Container>
    );
  }

  const records = (response as getPersonalRecordsResponseSuccess).data;

  return (
    <Container className="space-y-12 pb-24">
      <header className="flex items-center gap-6">
        <Link href="/profile">
          <button className="p-4 bg-card border border-border hover:border-primary/50 rounded-[1.5rem] transition-all active:scale-90 group shadow-sm">
            <CaretLeftIcon weight="bold" className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </Link>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <PageHeader 
            title="RECORDES" 
            subtitle="Sua Galeria de Elite" 
          />
          <UpsertPersonalRecordDialog />
        </div>
      </header>

      {/* Featured Insight */}
      <div className="bg-primary border border-primary/20 rounded-[3rem] p-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
          <TrophyIcon weight="fill" className="size-48 text-primary-foreground" />
        </div>
        
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="space-y-2">
            <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
              Personal Records (PR)
            </span>
            <h2 className="text-4xl font-anton italic text-primary-foreground uppercase leading-none mt-5!">Hall da Fama</h2>
          </div>
          <p className="text-primary-foreground/80 font-medium leading-relaxed">
            Cada novo recorde registrado aqui não apenas prova sua evolução, mas também inspira sua rede e garante um bônus massivo de 100 XP por conquista.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-2xl font-anton italic text-white">{records.length}</span>
              <span className="text-[9px] font-black text-primary-foreground/60 uppercase tracking-widest">Exercícios Dominados</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex flex-col">
              <span className="text-2xl font-anton italic text-white">{records.reduce((acc, curr) => acc + curr.weightInGrams, 0) / 1000}kg</span>
              <span className="text-[9px] font-black text-primary-foreground/60 uppercase tracking-widest">Volume Total de PRs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {records.length > 0 ? (
          records.map((record) => (
            <div 
              key={record.id}
              className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <BarbellIcon weight="fill" className="size-20 text-primary" />
              </div>

              <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">Exercício</p>
                <h3 className="text-2xl font-anton italic uppercase tracking-tight text-foreground">{record.exerciseName}</h3>
              </div>

              <div className="flex items-end justify-between relative z-10">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Carga Máxima</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-anton italic text-foreground leading-none">{record.weightInGrams / 1000}</p>
                    <span className="text-sm font-black text-primary uppercase italic">kg</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Esforço</p>
                  <p className="text-lg font-anton italic text-foreground leading-none">{record.reps} REPS</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon weight="duotone" className="size-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{dayjs(record.achievedAt).format("DD MMM, YYYY")}</span>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <TrendUpIcon weight="bold" className="size-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest">New PB</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-6 bg-card/50 border border-dashed border-border rounded-[3rem]">
            <div className="size-24 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
              <TrophyIcon weight="duotone" className="size-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase italic tracking-tight">Galeria Vazia</h3>
              <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">
                Você ainda não registrou nenhum recorde pessoal. Que tal começar hoje?
              </p>
            </div>
            <UpsertPersonalRecordDialog />
          </div>
        )}
      </div>
    </Container>
  );
}
