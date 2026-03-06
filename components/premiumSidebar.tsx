"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, Bell, TrendingUp } from "lucide-react";
import { UserNav } from "@/components/userNav";
import { ConsistencyGrid } from "@/components/consistencyGrid";
import { GetHomeData200 } from "@/lib/api/fetch-generated";

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
}

export function PremiumSidebar({ homeData }: PremiumSidebarProps) {
  return (
    <aside className="hidden 2xl:flex w-120 xl:w-130 bg-card border-l border-border flex-col h-screen overflow-y-auto custom-scrollbar sticky top-0">
      <div className="p-12 space-y-12">
        
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
            <Link href="/blog">
              <button className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-1 group cursor-pointer">
                Ver tudo
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            {MOCK_POSTS.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article 
                  className="group bg-background rounded-[2.5rem] border border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden flex items-center"
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
                      <BookOpen className="size-3" />
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
