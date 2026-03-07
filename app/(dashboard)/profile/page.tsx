import { getUserTrainData, getUserTrainDataResponseSuccess } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { PersonIcon, RulerIcon, BarbellIcon, UserIcon } from "@phosphor-icons/react/ssr";
import { LogoutButton } from "./logout-button";
import { PageHeader } from "@/components/pageHeader";
import { Container } from "@/components/common/container";

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
      icon: PersonIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Cm",
      value: trainData?.heightInCentimeters || "--",
      icon: RulerIcon,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      label: "Gc",
      value: trainData?.bodyFatPercentage ? `${(trainData.bodyFatPercentage * 100).toFixed(0)}%` : "--",
      icon: BarbellIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Anos",
      value: trainData?.age || "--",
      icon: UserIcon,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <Container>
      
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <PageHeader 
          title="PERFIL" 
          subtitle="Seu Painel Pessoal" 
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />
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
              <stat.icon weight="duotone" className={`size-6 ${stat.color}`} />
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

    </Container>
  );
}
