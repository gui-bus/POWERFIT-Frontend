import { getUserTrainData, getUserTrainDataResponseSuccess } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Weight, Ruler, BicepsFlexed, User, LogOut, TrendingUp } from "lucide-react";
import { LogoutButton } from "./logout-button";

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

  const { data: trainData } = userTrainDataResponse as getUserTrainDataResponseSuccess;

  const stats = [
    {
      label: "Kg",
      value: trainData?.weightInGrams ? (trainData.weightInGrams / 1000).toFixed(1) : "--",
      icon: Weight,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Cm",
      value: trainData?.heightInCentimeters || "--",
      icon: Ruler,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      label: "Gc",
      value: trainData?.bodyFatPercentage ? `${(trainData.bodyFatPercentage * 100).toFixed(0)}%` : "--",
      icon: BicepsFlexed,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Anos",
      value: trainData?.age || "--",
      icon: User,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="relative z-10 max-w-350 mx-auto p-6 sm:p-10 lg:p-16 space-y-12">
      
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Image 
              src="/images/powerfit-logo.svg" 
              alt="PowerFit" 
              width={140} 
              height={16} 
              className="h-5 w-auto" 
            />
            <h1 className="font-anton text-3xl text-primary italic uppercase tracking-widest leading-none">
              PROFILE
            </h1>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] pl-1">
            Seu Painel Pessoal
          </p>
        </div>

        <div className="flex items-center gap-4 bg-card/50 backdrop-blur-md border border-border px-6 py-3 rounded-[1.5rem] shadow-sm">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">Status da Conta</p>
            <p className="text-sm font-black uppercase italic text-foreground leading-none">Plano Básico</p>
          </div>
        </div>
      </header>

      {/* User Info Section */}
      <section className="bg-card/30 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="relative size-24 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
            {session.data.user.image ? (
              <Image 
                src={session.data.user.image} 
                alt={session.data.user.name} 
                fill
                className="object-cover"
              />
            ) : (
              <div className="size-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black italic">
                {session.data.user.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-anton text-foreground uppercase tracking-wider leading-none">
              {session.data.user.name}
            </h2>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] italic">
              {session.data.user.email}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card/50 backdrop-blur-xl border border-border rounded-[2rem] p-8 flex flex-col items-center justify-center gap-6 shadow-lg hover:border-primary/30 transition-all group">
            <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
              <stat.icon className={`size-6 ${stat.color}`} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-anton text-foreground leading-none">{stat.value}</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Section */}
      <div className="flex justify-center pt-4">
        <LogoutButton />
      </div>

      {/* Mobile Spacer */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
