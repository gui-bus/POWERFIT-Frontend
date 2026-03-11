import Link from "next/link";
import Image from "next/image";
import { 
  BookOpenIcon, 
  ArrowRightIcon, 
  TrendUpIcon,
  TrophyIcon,
  LightningIcon,
  StarIcon,
  UsersIcon
} from "@phosphor-icons/react/ssr";
import { ConsistencyGrid } from "@/components/consistencyGrid";
import { GetHomeData200, GetMe200 } from "@/lib/api/fetch-generated";

const MOCK_POSTS = [
  {
    id: 1,
    slug: "hipertrofia-maxima",
    title: "Hipertrofia Máxima: A ciência por trás das repetições",
    category: "Treinamento",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    slug: "nutricao-peri-treino",
    title: "Nutrição Peri-treino: O que comer antes e depois",
    category: "Dieta",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    slug: "sono-e-performance",
    title: "Sono e Performance: O anabolizante natural",
    category: "Recovery",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 4,
    slug: "mobilidade-articular",
    title: "Mobilidade Articular: Base para Força",
    category: "Mobilidade",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=400"
  }
];

interface PremiumSidebarProps {
  homeData: GetHomeData200;
  userData: GetMe200;
}

export function PremiumSidebar({ homeData, userData }: PremiumSidebarProps) {


  const xpInCurrentLevel = userData.xp % 1000;
  const progressPercent = (xpInCurrentLevel / 1000) * 100;

  return (
    <aside className="hidden 2xl:flex w-120 xl:w-130 bg-card border-l border-border flex-col h-screen overflow-y-auto custom-scrollbar sticky top-0">
      <div className="p-12 space-y-12">
        <div className="bg-primary border border-primary/20 rounded-[2.5rem] p-8 shadow-lg shadow-primary/10 overflow-hidden relative group">
          <div className="absolute -bottom-4 -right-4 opacity-20 group-hover:scale-110 transition-transform duration-700">
            <StarIcon weight="fill" className="size-32 text-primary-foreground" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-primary-foreground/70 uppercase tracking-[0.2em]">Seu Progresso</p>
                <h3 className="font-anton text-3xl italic text-primary-foreground uppercase leading-none">Nível {userData.level}</h3>
              </div>
              <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                <LightningIcon weight="fill" className="size-7" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-primary-foreground uppercase tracking-widest">{userData.xp} XP Total</p>
                <p className="text-[10px] font-black text-primary-foreground/70 uppercase tracking-widest">{xpInCurrentLevel} / 1000 XP</p>
              </div>
              <div className="h-3 bg-black/20 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Link href="/ranking">
            <button className="w-full bg-background dark:bg-zinc-800 border border-border hover:border-primary/30 rounded-3xl p-4 text-center transition-all hover:shadow-xl group cursor-pointer">
              <TrophyIcon weight="duotone" className="size-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-[9px] font-black uppercase italic tracking-widest text-foreground">Ranking</p>
            </button>
          </Link>
          <Link href="/friends">
            <button className="w-full bg-background dark:bg-zinc-800 border border-border hover:border-primary/30 rounded-3xl p-4 text-center transition-all hover:shadow-xl group cursor-pointer">
              <UsersIcon weight="duotone" className="size-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-[9px] font-black uppercase italic tracking-widest text-foreground">Amigos</p>
            </button>
          </Link>
          <Link href="/achievements">
            <button className="w-full bg-background dark:bg-zinc-800 border border-border hover:border-primary/30 rounded-3xl p-4 text-center transition-all hover:shadow-xl group cursor-pointer">
              <StarIcon weight="duotone" className="size-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-[9px] font-black uppercase italic tracking-widest text-foreground">Conquistas</p>
            </button>
          </Link>
        </div>

        <div className="bg-background dark:bg-zinc-800 rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
          <ConsistencyGrid 
            consistencyByDay={homeData.consistencyByDay} 
            streak={homeData.workoutStreak} 
          />
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-primary">
              <TrendUpIcon weight="duotone" className="size-5" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">POWER INSIGHTS</h3>
            </div>
            <Link href="/blog">
              <button className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-1 group cursor-pointer">
                Ver tudo
                <ArrowRightIcon weight="duotone" className="size-3 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            {MOCK_POSTS.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article 
                  className="group bg-background dark:bg-zinc-800 rounded-[2.5rem] border border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden flex items-center"
                >
                  <div className="relative aspect-square size-32 min-w-32 overflow-hidden">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between gap-2">
                    <div className="space-y-2">
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest px-2 py-1 rounded-md bg-primary/10 w-fit block">
                        {post.category}
                      </span>
                      <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                        {post.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpenIcon weight="duotone" className="size-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{post.readTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
