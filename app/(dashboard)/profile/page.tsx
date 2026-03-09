import {
  getUserTrainData,
  getUserTrainDataResponseSuccess,
  getMe,
  getXpHistory,
  getXpHistoryResponseSuccess,
  getFriends,
  getFriendsResponseSuccess,
  getFeed,
  getFeedResponseSuccess,
  GetXpHistory200ItemReason,
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  PersonIcon,
  RulerIcon,
  BarbellIcon,
  UserIcon,
  PencilSimpleIcon,
  StarIcon,
  LightningIcon,
  TrendUpIcon,
  CheckCircleIcon,
  ShareNetworkIcon,
  MedalIcon,
} from "@phosphor-icons/react/ssr";
import { LogoutButton } from "./logout-button";
import { EditProfileDialog } from "@/components/profile/editProfileDialog";
import dayjs from "dayjs";

const translateXpReason = (reason: GetXpHistory200ItemReason): string => {
  const translations: Record<string, string> = {
    WORKOUT_COMPLETED: "Treino Concluído",
    PERSONAL_RECORD: "Recorde Pessoal",
    STREAK_7_DAYS: "7 Dias Seguidos",
    STREAK_30_DAYS: "30 Dias Seguidos",
    POWERUP_GIVEN: "Powerup Enviado",
    POWERUP_RECEIVED: "Powerup Recebido",
    FRIEND_ACCEPTED: "Amizade Iniciada",
    CHALLENGE_COMPLETED: "Desafio Concluído",
    CHALLENGE_WON: "Desafio Vencido",
  };

  return translations[reason] || reason.replace(/_/g, " ");
};

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const [trainDataRes, meRes, xpRes, friendsRes, feedRes] = await Promise.all([
    getUserTrainData(),
    getMe(),
    getXpHistory(),
    getFriends(),
    getFeed(), // Para contar total de treinos postados
  ]);

  if (trainDataRes.status !== 200 || meRes.status !== 200) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center bg-background">
        <p className="text-muted-foreground font-medium text-lg italic uppercase tracking-tighter">
          Erro ao carregar dados do perfil.
        </p>
      </div>
    );
  }

  const trainData = (trainDataRes as getUserTrainDataResponseSuccess).data;
  const userData = meRes.data;
  const xpHistory =
    xpRes.status === 200 ? (xpRes as getXpHistoryResponseSuccess).data : [];
  const friendsCount =
    friendsRes.status === 200
      ? (friendsRes as getFriendsResponseSuccess).data.length
      : 0;
  const workoutsCount =
    feedRes.status === 200
      ? (feedRes as getFeedResponseSuccess).data.filter(
          (i) => i.userId === userData.id,
        ).length
      : 0;

  const biometrics = [
    {
      label: "Peso",
      value: trainData?.weightInGrams
        ? (trainData.weightInGrams / 1000).toFixed(1)
        : "--",
      unit: "kg",
      icon: PersonIcon,
    },
    {
      label: "Altura",
      value: trainData?.heightInCentimeters || "--",
      unit: "cm",
      icon: RulerIcon,
    },
    {
      label: "Gordura",
      value: trainData?.bodyFatPercentage
        ? `${(trainData.bodyFatPercentage * 100).toFixed(1)}%`
        : "--",
      unit: "%",
      icon: BarbellIcon,
    },
    {
      label: "Idade",
      value: trainData?.age || "--",
      unit: "anos",
      icon: UserIcon,
    },
  ];

  return (
    <main className="pb-10">
      {/* Social Profile Header Section */}
      <section className="relative">
        {/* Cover Image / Banner */}
        <div className="h-48 sm:h-64 w-full bg-linear-to-br from-primary/30 via-primary/10 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/background.png')] opacity-10 bg-center bg-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
        </div>

        {/* Profile Content Overlay */}
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="relative -mt-20 sm:-mt-24 flex flex-col md:flex-row items-end gap-6 pb-8 border-b border-border">
            {/* Avatar with Ring */}
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110 group-hover:bg-primary/30 transition-all duration-500" />
              <div className="relative size-32 sm:size-44 rounded-[2.5rem] p-1.5 bg-background shadow-2xl border border-border">
                <div className="relative size-full rounded-[2rem] overflow-hidden bg-muted">
                  {userData.image ? (
                    <Image
                      src={userData.image}
                      alt={userData.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="size-full bg-linear-to-br from-primary to-orange-600 flex items-center justify-center text-white text-6xl font-black italic">
                      {userData.name.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Online/Verified Badge */}
                <div className="absolute -bottom-1 -right-1 size-10 bg-background rounded-2xl flex items-center justify-center shadow-xl border border-border">
                  <CheckCircleIcon
                    weight="fill"
                    className="size-6 text-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Basic Info & Actions */}
            <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 w-full pb-4">
              <div className="text-center sm:text-left space-y-2">
                <h1 className="text-4xl sm:text-5xl font-anton text-foreground uppercase tracking-tight italic leading-none">
                  {userData.name}
                </h1>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                  Nível {userData.level} · Atleta Elite
                </span>
              </div>

              <div className="flex items-center gap-3">
                <EditProfileDialog initialData={trainData}>
                  <button className="px-6 py-3 bg-card border border-border hover:border-primary/50 rounded-2xl font-black uppercase italic tracking-widest text-[10px] flex items-center gap-2 transition-all active:scale-95 shadow-sm">
                    <PencilSimpleIcon
                      weight="bold"
                      className="size-4 text-primary"
                    />
                    Editar Perfil
                  </button>
                </EditProfileDialog>
                <button className="p-3 bg-card border border-border hover:border-primary/50 rounded-2xl transition-all active:scale-95 group">
                  <ShareNetworkIcon weight="bold" className="size-5 text-muted-foreground group-hover:text-primary" />
                </button>
              </div>
            </div>
          </div>

          {/* Social Stats Row */}
          <div className="flex items-center justify-around sm:justify-start sm:gap-16 py-8">
            <div className="text-center sm:text-left cursor-default group">
              <p className="text-2xl font-anton italic text-foreground group-hover:text-primary transition-colors leading-none">
                {workoutsCount}
              </p>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1.5">
                Treinos
              </p>
            </div>
            <div className="text-center sm:text-left cursor-default group">
              <p className="text-2xl font-anton italic text-foreground group-hover:text-primary transition-colors leading-none">
                {friendsCount}
              </p>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1.5">
                Conexões
              </p>
            </div>
            <div className="text-center sm:text-left cursor-default group">
              <p className="text-2xl font-anton italic text-primary leading-none">
                {userData.xp}
              </p>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1.5">
                XP Acumulado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Biometrics & Progress */}
          <div className="space-y-8 lg:col-span-1">
            <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                <BarbellIcon weight="duotone" className="size-5 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] italic">
                  Biometria
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {biometrics.map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl font-anton italic text-foreground leading-none">
                        {stat.value}
                      </p>
                      <span className="text-[9px] font-black text-primary uppercase italic">
                        {stat.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-border/50">
                <div className="flex justify-between items-end mb-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">
                    Próximo Nível
                  </p>
                  <p className="text-[10px] font-black text-primary italic">
                    {userData.xp % 1000} / 1000 XP
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden p-0.5 border border-border shadow-inner">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,100,0,0.3)]"
                    style={{ width: `${(userData.xp % 1000) / 10}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-primary to-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group cursor-pointer">
              <div className="absolute -bottom-4 -right-4 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <MedalIcon weight="fill" className="size-32" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <LightningIcon weight="fill" className="size-6" />
                </div>
                <div>
                  <h4 className="text-xl font-anton italic uppercase leading-none">
                    Power Insight
                  </h4>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-2">
                    Você está 12% acima da média de consistência da sua network!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: XP History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <TrendUpIcon weight="duotone" className="size-6 text-primary" />
                <h3 className="text-base font-black uppercase tracking-[0.2em] italic">
                  Atividades de Experiência
                </h3>
              </div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Últimos 30 dias
              </span>
            </div>

            <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="divide-y divide-border/50">
                {xpHistory.length > 0 ? (
                  xpHistory.slice(0, 8).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-6 hover:bg-primary/2 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <StarIcon
                            weight="duotone"
                            className="size-5 text-muted-foreground group-hover:text-primary transition-colors"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-black uppercase italic tracking-tight text-foreground group-hover:text-primary transition-colors">
                            {translateXpReason(item.reason)}
                          </p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            {dayjs(item.createdAt).format(
                              "DD MMM, YYYY · HH:mm",
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="font-anton text-lg italic text-primary">
                        +{item.amount} XP
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground font-medium uppercase italic tracking-widest text-xs">
                      Nenhum registro encontrado.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logout Area */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-16 flex flex-col items-center gap-8">
        <div className="h-px w-24 bg-linear-to-r from-transparent via-border to-transparent" />
        <LogoutButton />
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.5em] opacity-50 italic">
          POWER.FIT PERFORMANCE SYSTEM
        </p>
      </div>
    </main>
  );
}
