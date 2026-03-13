import { 
  getAchievements, 
  getAchievementsResponseSuccess 
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { MedalIcon, LockIcon, StarIcon, CheckCircleIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

export const metadata: Metadata = {
  title: "Conquistas",
};

export default async function AchievementsPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const response = await getAchievements();

  if (response.status !== 200) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-[2.5rem]">
          <p className="text-muted-foreground font-medium italic uppercase tracking-tighter">
            Erro ao carregar conquistas.
          </p>
        </div>
      </Container>
    );
  }

  const achievements = (response as getAchievementsResponseSuccess).data;
  
  const unlocked = achievements.filter(a => a.unlockedAt);
  const locked = achievements.filter(a => !a.unlockedAt);

  return (
    <Container className="space-y-16 pb-20">
      <header>
        <PageHeader 
          title="CONQUISTAS" 
          subtitle="Sua galeria de troféus" 
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
            role: (session.data.user as any).role as "ADMIN" | "USER",
          }}
        />
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-[2.5rem] p-8 flex items-center gap-6 shadow-sm">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MedalIcon weight="duotone" className="size-8 text-primary" />
          </div>
          <div>
            <p className="text-3xl font-anton italic text-foreground leading-none">{unlocked.length}</p>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Desbloqueadas</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-[2.5rem] p-8 flex items-center gap-6 shadow-sm">
          <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
            <LockIcon weight="duotone" className="size-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-3xl font-anton italic text-foreground leading-none">{locked.length}</p>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">A conquistar</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-[2.5rem] p-8 flex items-center gap-6 shadow-sm">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <StarIcon weight="duotone" className="size-8 text-primary" />
          </div>
          <div>
            <p className="text-3xl font-anton italic text-foreground leading-none">
              {unlocked.reduce((acc, curr) => acc + curr.xpReward, 0)}
            </p>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">XP em Bônus</p>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-12">
        <div className="px-2 flex items-center gap-3">
          <h2 className="text-base font-black text-foreground uppercase tracking-[0.2em] italic">Minha Galeria</h2>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={cn(
                "group relative bg-card border border-border rounded-[2.5rem] p-8 transition-all duration-500 overflow-hidden",
                achievement.unlockedAt 
                  ? "hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5" 
                  : "grayscale opacity-60"
              )}
            >
              {achievement.unlockedAt && (
                <div className="absolute top-0 right-0 p-6">
                  <CheckCircleIcon weight="fill" className="size-6 text-green-500" />
                </div>
              )}

              <div className="space-y-6 relative z-10">
                <div className={cn(
                  "size-20 rounded-[1.5rem] flex items-center justify-center border-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                  achievement.unlockedAt 
                    ? "bg-primary/10 border-primary/20 shadow-lg shadow-primary/10" 
                    : "bg-muted border-border"
                )}>
                  {achievement.iconUrl ? (
                    <Image src={achievement.iconUrl} alt={achievement.name} width={40} height={40} />
                  ) : (
                    <MedalIcon weight="duotone" className={cn("size-10", achievement.unlockedAt ? "text-primary" : "text-muted-foreground")} />
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-anton italic uppercase tracking-tight text-foreground leading-tight">
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium line-clamp-2">
                    {achievement.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <StarIcon weight="fill" className="size-3 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">+{achievement.xpReward} XP</span>
                  </div>
                  {achievement.unlockedAt && (
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      {dayjs(achievement.unlockedAt).format("DD/MM/YYYY")}
                    </p>
                  )}
                </div>
              </div>

              {/* Background Decoration */}
              <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                <MedalIcon weight="fill" className="size-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
