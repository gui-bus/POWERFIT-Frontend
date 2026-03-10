import { 
  getUserProfile, 
  getUserProfileResponseSuccess,
  getUserFeed,
  getUserFeedResponseSuccess,
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import {
  PersonIcon,
  RulerIcon,
  BarbellIcon,
  UserIcon,
  CheckCircleIcon,
  MedalIcon,
  CaretLeftIcon,
  UserPlusIcon,
  ClockIcon,
  ActivityIcon
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/common/container";
import { FeedItem } from "@/components/feed/feedItem";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { userId } = await params;
  
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");
  
  // Se for o próprio usuário, redireciona para o perfil privado
  if (userId === session.data.user.id) redirect("/profile");

  const [profileRes, feedRes] = await Promise.all([
    getUserProfile(userId),
    getUserFeed(userId)
  ]);

  if (profileRes.status !== 200) {
    if (profileRes.status === 404) notFound();
    if (profileRes.status === 403) {
      return (
        <Container className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="size-24 bg-muted rounded-full flex items-center justify-center">
            <UserIcon weight="duotone" className="size-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-anton italic uppercase text-foreground">Perfil Privado</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Este atleta optou por manter suas atividades privadas. Envie um pedido de amizade para se conectar!
            </p>
          </div>
          <Link href="/friends">
            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Voltar para Conexões
            </button>
          </Link>
        </Container>
      );
    }
    return redirect("/friends");
  }

  const user = (profileRes as getUserProfileResponseSuccess).data;
  const feedItems = feedRes.status === 200 ? (feedRes as getUserFeedResponseSuccess).data : [];

  const biometrics = user.stats ? [
    { label: "Peso", value: (user.stats.weightInGrams / 1000).toFixed(1), unit: "kg", icon: PersonIcon },
    { label: "Altura", value: user.stats.heightInCentimeters, unit: "cm", icon: RulerIcon },
    { label: "Gordura", value: `${(user.stats.bodyFatPercentage * 100).toFixed(1)}%`, unit: "%", icon: BarbellIcon },
    { label: "Idade", value: user.stats.age, unit: "anos", icon: UserIcon },
  ] : [];

  return (
    <main className="pb-10">
      <section className="relative">
        <div className="h-48 sm:h-64 w-full bg-linear-to-br from-primary/30 via-primary/10 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
          <Link href="/friends" className="absolute top-8 left-8 z-20">
            <button className="p-3 bg-card/50 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-card transition-all active:scale-90 group">
              <CaretLeftIcon weight="bold" className="size-5 text-white group-hover:text-primary" />
            </button>
          </Link>
        </div>

        <div className="px-6 sm:px-8">
          <div className="relative -mt-20 sm:-mt-24 flex flex-col md:flex-row items-end gap-6 pb-8 border-b border-border">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110" />
              <div className="relative size-32 sm:size-44 rounded-[2.5rem] p-1.5 bg-background shadow-2xl border border-border">
                <div className="relative size-full rounded-[2rem] overflow-hidden bg-muted">
                  {user.image ? (
                    <Image src={user.image} alt={user.name} fill className="object-cover" />
                  ) : (
                    <div className="size-full bg-linear-to-br from-primary to-orange-600 flex items-center justify-center text-white text-6xl font-black italic">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 w-full pb-4">
              <div className="text-center sm:text-left space-y-2">
                <h1 className="text-4xl sm:text-5xl font-anton text-foreground uppercase tracking-tight italic leading-none">
                  {user.name}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-muted-foreground">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                    Nível {user.level} · Atleta PowerFit
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!user.isFriend && !user.isPending && (
                  <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-primary/20">
                    <UserPlusIcon weight="bold" className="size-4" />
                    Adicionar Atleta
                  </button>
                )}
                {user.isPending && (
                  <button disabled className="px-8 py-4 bg-muted text-muted-foreground rounded-2xl font-black uppercase italic tracking-widest text-[10px] flex items-center gap-2">
                    <ClockIcon weight="bold" className="size-4" />
                    Pedido Enviado
                  </button>
                )}
                {user.isFriend && (
                  <div className="px-8 py-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-2xl font-black uppercase italic tracking-widest text-[10px] flex items-center gap-2">
                    <CheckCircleIcon weight="fill" className="size-4" />
                    Amigos
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-around sm:justify-start sm:gap-16 py-8">
            <div className="text-center sm:text-left">
              <p className="text-2xl font-anton italic text-foreground leading-none">{feedItems.length}</p>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1.5">Treinos</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-2xl font-anton italic text-foreground leading-none">{user.streak}</p>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1.5">Ofensiva</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-2xl font-anton italic text-primary leading-none">{user.xp}</p>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1.5">XP Total</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="space-y-8 lg:col-span-1">
            {/* Biometrics (Only if allowed or friend) */}
            {biometrics.length > 0 && (
              <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                  <BarbellIcon weight="duotone" className="size-5 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] italic">Biometria</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {biometrics.map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                      <div className="flex items-baseline gap-1">
                        <p className="text-xl font-anton italic text-foreground leading-none">{stat.value}</p>
                        <span className="text-[9px] font-black text-primary uppercase italic">{stat.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <MedalIcon weight="duotone" className="size-5 text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] italic">Conquistas</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {user.achievements.map((medal) => (
                  <div key={medal.id} className="aspect-square rounded-xl bg-muted/50 flex items-center justify-center border border-border/50 group/medal relative" title={medal.name}>
                    {medal.iconUrl ? (
                      <Image src={medal.iconUrl} alt={medal.name} width={24} height={24} />
                    ) : (
                      <MedalIcon weight="duotone" className="size-6 text-muted-foreground opacity-40" />
                    )}
                  </div>
                ))}
                {user.achievements.length === 0 && (
                  <div className="col-span-full py-4 text-center">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase italic">Nenhuma conquista ainda.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 px-2">
              <ActivityIcon weight="duotone" className="size-6 text-primary" />
              <h3 className="text-base font-black uppercase tracking-[0.2em] italic">Atividade Recente</h3>
            </div>

            <div className="space-y-6">
              {feedItems.length > 0 ? (
                feedItems.map((item) => (
                  <FeedItem key={item.id} item={item} />
                ))
              ) : (
                <div className="py-20 text-center bg-muted/20 rounded-[3rem] border border-dashed border-border/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Nenhuma atividade pública para mostrar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
