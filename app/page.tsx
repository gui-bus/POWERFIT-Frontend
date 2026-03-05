import { getHomeData, getHomeDataResponseSuccess, getWorkoutPlanById, getWorkoutPlanByIdResponseSuccess, GetWorkoutPlanById200WorkoutDaysItem } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import Image from "next/image";
import { ConsistencyGrid } from "@/components/consistencyGrid";
import { WorkoutCard } from "@/components/workoutCard";
import { BottomNav } from "@/components/bottomNav";
import { Bell, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { UserNav } from "@/components/userNav";

const MOCK_POSTS = [
  {
    id: 1,
    title: "Hipertrofia Máxima: A ciência por trás das repetições",
    category: "Treinamento",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    title: "Nutrição Peri-treino: O que comer antes e depois",
    category: "Dieta",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    title: "Sono e Performance: O anabolizante natural",
    category: "Recovery",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 4,
    title: "Mobilidade Articular: Base para Força",
    category: "Mobilidade",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=400"
  }
];

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const homeResponse = await getHomeData(today.format("YYYY-MM-DD"));

  if ("error" in homeResponse) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center bg-background">
        <div className="max-w-xs space-y-4">
          <div className="size-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <p className="text-2xl font-bold">!</p>
          </div>
          <p className="text-muted-foreground font-medium">Erro ao carregar dados. Verifique sua conexão.</p>
        </div>
      </div>
    );
  }

  const { data: homeData } = homeResponse as getHomeDataResponseSuccess;

  let workoutDays: GetWorkoutPlanById200WorkoutDaysItem[] = [];
  if (homeData.activeWorkoutPlanId) {
    const planResponse = await getWorkoutPlanById(homeData.activeWorkoutPlanId);
    if (!("error" in planResponse)) {
      const { data: planData } = planResponse as getWorkoutPlanByIdResponseSuccess;
      workoutDays = planData.workoutDays;
    }
  }

  const consistencyValues = Object.values(homeData.consistencyByDay);
  const totalDays = consistencyValues.length;
  const completedDays = consistencyValues.filter(day => day.workoutDayCompleted).length;
  const weeklyProgress = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  const activeWorkoutDayId = homeData.todayWorkoutDay?.id;

  return (
    <div className="relative min-h-screen bg-background flex flex-col lg:flex-row overflow-x-hidden selection:bg-primary/20 selection:text-primary transition-colors duration-500">
      <BottomNav />

      <main className="flex-1 lg:ml-24 xl:ml-28 h-screen overflow-y-auto custom-scrollbar bg-background">
        <div className="max-w-300 mx-auto pb-32 lg:pb-12 px-5 sm:px-10 lg:px-12">
          
          <header className="flex items-center justify-between py-8 lg:py-10">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight uppercase italic leading-none">Dashboard</h1>
              <p className="hidden sm:block text-xs lg:text-sm text-muted-foreground font-medium uppercase tracking-wider mt-1">
                Bem-vindo de volta, {session.data.user.name.split(" ")[0]}!
              </p>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-6 lg:hidden">
              <button className="relative size-12 bg-card border border-border rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Bell className="size-5" />
                <span className="absolute top-3 right-3 size-2 bg-primary rounded-full border-2 border-background" />
              </button>
              
              <UserNav user={{
                name: session.data.user.name,
                email: session.data.user.email,
                image: session.data.user.image
              }} />
            </div>
          </header>

          <div className="lg:pt-0">
            <section className="relative aspect-16/10 sm:aspect-21/9 lg:h-105 w-full overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl shadow-primary/10">
              <Image
                src="/images/login-bg.png"
                alt="Banner"
                fill
                className="object-cover scale-105"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90" />
              <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent opacity-60" />
              
              <div className="absolute inset-0 flex flex-col justify-end lg:justify-between p-6 sm:p-10 lg:p-16">
                <div className="hidden lg:block">
                  <h1 className="font-syne text-2xl font-black text-white uppercase italic tracking-tighter">
                    P.
                  </h1>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
                  <div className="space-y-2 lg:space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-primary text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-primary-foreground px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg shadow-primary/20">
                      <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary-foreground"></span>
                      </span>
                      Meta Semanal
                    </div>
                    <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85] drop-shadow-2xl">
                      FOCO <br className="hidden lg:block" />
                      <span className="text-primary">TOTAL</span>.
                    </h2>
                    <p className="text-[10px] sm:text-sm lg:text-lg text-white/70 font-medium max-w-xs sm:max-w-md drop-shadow">
                      Seu plano atual está {weeklyProgress}% completo. Mantenha o ritmo!
                    </p>
                  </div>

                  <button className="group bg-white hover:bg-primary text-black hover:text-white px-6 sm:px-8 py-3 sm:py-4 lg:px-10 lg:py-5 rounded-2xl sm:rounded-[2rem] text-[10px] sm:text-sm lg:text-base font-black uppercase italic transition-all shadow-2xl active:scale-95 flex items-center gap-3 sm:gap-4 w-fit">
                    Bora Treinar
                    <div className="size-6 sm:size-8 lg:size-10 bg-black group-hover:bg-white rounded-full flex items-center justify-center transition-colors">
                      <Sparkles className="size-3 sm:size-4 lg:size-5 text-white group-hover:text-primary" />
                    </div>
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 space-y-12">
            <div className="space-y-6">
              <div className="px-5 lg:px-0 flex items-end justify-between">
                <div>
                  <h2 className="text-xl lg:text-2xl font-black text-foreground tracking-tight uppercase italic leading-none">Seu Plano</h2>
                  <p className="text-[10px] lg:text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Todos os treinos da semana</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {workoutDays.map((day) => (
                  <WorkoutCard 
                    key={day.id} 
                    workout={day} 
                    isActive={day.id === activeWorkoutDayId}
                  />
                ))}
              </div>
            </div>

            <div className="lg:hidden px-5 pb-10">
               <ConsistencyGrid 
                consistencyByDay={homeData.consistencyByDay} 
                streak={homeData.workoutStreak} 
              />
            </div>
          </div>
        </div>
      </main>

      <aside className="hidden lg:flex w-120 xl:w-130 bg-card border-l border-border flex-col h-screen overflow-y-auto custom-scrollbar">
        <div className="p-12 space-y-12">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserNav user={{
                name: session.data.user.name,
                email: session.data.user.email,
                image: session.data.user.image
              }} />
              <div>
                <p className="text-sm font-black uppercase italic leading-none">{session.data.user.name.split(" ")[0]}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Elite Atleta</p>
              </div>
            </div>
            <button className="relative size-12 bg-background border border-border rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
              <Bell className="size-5" />
              <span className="absolute top-3 right-3 size-2 bg-primary rounded-full border-2 border-background" />
            </button>
          </div>

          <div className="bg-background rounded-[2.5rem] border border-border overflow-hidden">
            <ConsistencyGrid 
              consistencyByDay={homeData.consistencyByDay} 
              streak={homeData.workoutStreak} 
            />
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-primary">
                <BookOpen className="size-5" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">POWER INSIGHTS</h3>
              </div>
              <button className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-1 group">
                Ver tudo
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {MOCK_POSTS.map((post) => (
                <article 
                  key={post.id} 
                  className="group bg-background rounded-[2.5rem] border border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-background/80 backdrop-blur-md text-[8px] font-black text-primary uppercase tracking-widest px-2.5 py-1.5 rounded-lg border border-white/10">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                    <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-3 text-foreground">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="size-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{post.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}
