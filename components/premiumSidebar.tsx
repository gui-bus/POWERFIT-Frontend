"use client";

import Image from "next/image";
import { BookOpen, ArrowRight, Bell, TrendingUp } from "lucide-react";
import { UserNav } from "@/components/userNav";
import { ConsistencyGrid } from "@/components/consistencyGrid";
import { GetHomeData200 } from "@/lib/api/fetch-generated";

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

interface PremiumSidebarProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  homeData: GetHomeData200;
}

export function PremiumSidebar({ user, homeData }: PremiumSidebarProps) {
  return (
    <aside className="hidden 2xl:flex w-120 xl:w-130 bg-card border-l border-border flex-col h-screen overflow-y-auto custom-scrollbar sticky top-0">
      <div className="p-12 space-y-12">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <UserNav user={user} />
            <div>
              <p className="text-sm font-black uppercase italic leading-none">{user.name.split(" ")[0]}</p>
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
              <TrendingUp className="size-5" />
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
  );
}
