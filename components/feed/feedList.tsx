"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  getFeed, 
  getUserFeed,
  GetFeed200ActivitiesItem, 
} from "@/lib/api/fetch-generated";
import { FeedItem } from "@/components/feed/feedItem";
import { UsersIcon, PlusIcon, UserPlusIcon, SpinnerIcon, ActivityIcon } from "@phosphor-icons/react";
import Link from "next/link";

interface FeedListProps {
  initialItems: GetFeed200ActivitiesItem[];
  initialNextCursor: string | null;
  userId?: string;
}

export function FeedList({ initialItems, initialNextCursor, userId }: FeedListProps) {
  const [items, setItems] = useState<GetFeed200ActivitiesItem[]>(initialItems);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchMore = useCallback(async () => {
    if (isLoading || !nextCursor) return;

    setIsLoading(true);
    setHasError(false);

    try {
      const params = {
        limit: 5,
        cursor: nextCursor,
      };

      const response = userId 
        ? await getUserFeed(userId, params)
        : await getFeed(params);

      if (response.status === 200) {
        const { activities, nextCursor: newCursor } = response.data;
        setItems((prev) => [...prev, ...activities]);
        setNextCursor(newCursor);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Failed to fetch more feed items", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, nextCursor, userId]);

  useEffect(() => {
    const target = observerTarget.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !isLoading) {
          fetchMore();
        }
      },
      { threshold: 0.1 }
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [fetchMore, nextCursor, isLoading]);

  if (items.length === 0 && !isLoading) {
    if (userId) {
      return (
        <div className="flex flex-col items-center justify-center p-16 text-center bg-card/50 border border-dashed border-border rounded-[3rem] space-y-6">
          <div className="size-24 bg-muted rounded-full flex items-center justify-center opacity-50">
            <ActivityIcon weight="duotone" className="size-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase italic tracking-tight opacity-80">Sem treinos recentes</h3>
            <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">
              Este atleta ainda não registrou atividades públicas no feed.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-16 text-center bg-card/50 border border-dashed border-border rounded-[3rem] space-y-8">
        <div className="relative">
          <div className="size-24 bg-muted rounded-full flex items-center justify-center">
            <UsersIcon weight="duotone" className="size-12 text-muted-foreground" />
          </div>
          <div className="absolute -bottom-2 -right-2 size-10 bg-primary rounded-full flex items-center justify-center shadow-lg text-primary-foreground">
            <PlusIcon weight="bold" className="size-5" />
          </div>
        </div>
        
        <div className="space-y-3 max-w-sm mx-auto">
          <h3 className="text-2xl font-black uppercase italic tracking-tight">O feed está em silêncio</h3>
          <p className="text-sm text-muted-foreground font-medium">
            Sua rede de atletas ainda não registrou atividades hoje. Que tal ser o primeiro a postar um treino?
          </p>
        </div>

        <Link href="/friends">
          <button className="bg-primary text-primary-foreground px-10 py-5 rounded-[1.5rem] font-black uppercase italic tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            <UserPlusIcon weight="bold" className="size-4" />
            Encontrar Atletas
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-8">
        {items.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}
      </div>

      <div 
        ref={observerTarget} 
        className="w-full py-12 flex flex-col items-center justify-center gap-4"
      >
        {isLoading && (
          <>
            <SpinnerIcon className="size-8 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic animate-pulse">
              Carregando mais atividades...
            </p>
          </>
        )}
        
        {hasError && (
          <button 
            onClick={fetchMore}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic border border-primary/20 px-6 py-3 rounded-full hover:bg-primary/5 transition-all"
          >
            Erro ao carregar. Tentar novamente?
          </button>
        )}

        {!nextCursor && items.length > 0 && (
          <div className="flex items-center gap-4 w-full">
            <div className="h-px flex-1 bg-border/50" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 italic whitespace-nowrap">
              Você chegou ao fim do feed
            </p>
            <div className="h-px flex-1 bg-border/50" />
          </div>
        )}
      </div>
    </div>
  );
}
