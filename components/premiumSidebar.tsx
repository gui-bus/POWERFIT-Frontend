import Link from "next/link";
import { 
  ArrowRightIcon, 
  TrendUpIcon,
} from "@phosphor-icons/react/ssr";
import { ConsistencyGrid } from "@/components/consistencyGrid";
import { GetHomeData200, GetMe200 } from "@/lib/api/fetch-generated";
import { BlogCard } from "./premiumSidebar/blogCard";
import { LevelProgress } from "./premiumSidebar/levelProgress";
import { QuickActions } from "./premiumSidebar/quickActions";
import { WaterTracker } from "./waterTracker/waterTracker";

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
  return (
    <aside className="hidden 2xl:flex w-120 xl:w-130 bg-card border-l border-border flex-col h-screen overflow-y-auto custom-scrollbar sticky top-0">
      <div className="p-12 space-y-12">
        <LevelProgress userData={userData} />

        <QuickActions />

        <WaterTracker />

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
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
