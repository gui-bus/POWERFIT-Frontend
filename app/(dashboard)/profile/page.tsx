import {
  getUserTrainData,
  getUserTrainDataResponseSuccess,
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
  EnvelopeIcon,
  CalendarIcon,
} from "@phosphor-icons/react/ssr";
import { LogoutButton } from "./logout-button";
import { PageHeader } from "@/components/pageHeader";
import { Container } from "@/components/common/container";
import { EditProfileDialog } from "@/components/profile/editProfileDialog";

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const userTrainDataResponse = await getUserTrainData();

  if ("error" in userTrainDataResponse) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center bg-background">
        <p className="text-muted-foreground font-medium text-lg italic uppercase tracking-tighter">
          Erro ao carregar dados do perfil.
        </p>
      </div>
    );
  }

  const { data: trainData } =
    userTrainDataResponse as getUserTrainDataResponseSuccess;

  const stats = [
    {
      label: "Peso Atual",
      value: trainData?.weightInGrams
        ? (trainData.weightInGrams / 1000).toFixed(1)
        : "--",
      unit: "kg",
      icon: PersonIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Estatura",
      value: trainData?.heightInCentimeters || "--",
      unit: "cm",
      icon: RulerIcon,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      label: "Gordura",
      value: trainData?.bodyFatPercentage
        ? `${(trainData.bodyFatPercentage * 100).toFixed(1)}%`
        : "--",
      unit: "Corporal",
      icon: BarbellIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Idade",
      value: trainData?.age || "--",
      unit: "anos",
      icon: UserIcon,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <Container className="space-y-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <PageHeader
          title="PERFIL"
          subtitle="Configurações & Biometria"
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />
      </header>

      <div className="max-w-5xl mx-auto w-full space-y-10">
        {/* Profile Card */}
        <section className="relative overflow-hidden bg-card border border-border rounded-[3rem] shadow-2xl group">

          <div className="relative p-8 sm:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
              {/* Avatar Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <div className="relative size-20 sm:size-24 rounded-2xl overflow-hidden border-2 border-background shadow-xl ring-1 ring-border bg-muted">
                  {session.data.user.image ? (
                    <Image
                      src={session.data.user.image}
                      alt={session.data.user.name}
                      fill
                      priority
                      quality={100}
                      sizes="(max-width: 640px) 80px, 96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="size-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-6xl font-black italic">
                      {session.data.user.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 text-center md:text-left space-y-6">
                <div className="space-y-2">
                  <h2 className="text-5xl font-anton text-foreground uppercase tracking-tight leading-none italic">
                    {session.data.user.name}
                  </h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                    <div className="inline-flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-1.5 rounded-full border border-border/50 shadow-sm">
                      <EnvelopeIcon weight="duotone" className="size-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{session.data.user.email}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-1.5 rounded-full border border-border/50 shadow-sm">
                      <CalendarIcon weight="duotone" className="size-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Atleta PowerFit</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-center md:justify-start">
                  <EditProfileDialog initialData={trainData}>
                    <button className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-[1.5rem] font-black uppercase italic tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative">Editar Biometria</span>
                      <PencilSimpleIcon weight="bold" className="size-4 relative" />
                    </button>
                  </EditProfileDialog>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-6 shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon weight="fill" className="size-16" />
              </div>
              
              <div
                className={`p-5 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-500 shadow-inner`}
              >
                <stat.icon weight="duotone" className={`size-7 ${stat.color}`} />
              </div>
              
              <div className="text-center space-y-1">
                <div className="flex items-baseline justify-center gap-1">
                  <p className="text-4xl font-anton text-foreground leading-none tracking-tight italic">
                    {stat.value}
                  </p>
                  {stat.value !== "--" && (
                    <span className="text-[11px] font-black text-primary uppercase italic tracking-tighter">
                      {stat.unit}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col items-center gap-8 pt-8">
        <div className="h-px w-24 bg-linear-to-r from-transparent via-border to-transparent" />
        <LogoutButton />
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.5em] opacity-50">
          POWER.FIT
        </p>
      </div>
    </Container>
  );
}
