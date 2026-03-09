"use client";

import { GetFeed200Item, togglePowerup } from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LightningIcon, ChatTeardropIcon } from "@phosphor-icons/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface FeedItemProps {
  item: GetFeed200Item;
}

export function FeedItem({ item }: FeedItemProps) {
  const router = useRouter();
  const [hasPowerup, setHasPowerup] = useState(item.hasPowerupByMe);
  const [powerupsCount, setPowerupsCount] = useState(item.powerupsCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePowerup = async () => {
    if (isLoading) return;

    const previousHasPowerup = hasPowerup;
    const previousPowerupsCount = powerupsCount;

    setIsLoading(true);
    setHasPowerup(!hasPowerup);
    setPowerupsCount((prev) => (hasPowerup ? prev - 1 : prev + 1));

    try {
      const response = await togglePowerup(item.id);

      if (response.status === 204) {
        router.refresh();
      } else {
        setHasPowerup(previousHasPowerup);
        setPowerupsCount(previousPowerupsCount);
      }
    } catch (error) {
      console.error("Failed to toggle powerup", error);
      setHasPowerup(previousHasPowerup);
      setPowerupsCount(previousPowerupsCount);
    } finally {
      setIsLoading(false);
    }
  };

  const timeAgo = dayjs(item.completedAt).fromNow();

  return (
    <article className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-border">
              <AvatarImage src={item.userImage || ""} alt={item.userName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {item.userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-black uppercase italic tracking-tight text-foreground">
                {item.userName}
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {timeAgo}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground leading-relaxed">
              Completou o treino{" "}
              <span className="text-primary font-black italic uppercase">
                {item.workoutDayName}
              </span>{" "}
              do plano <span className="font-bold">{item.workoutPlanName}</span>
              .
            </p>
            {item.statusMessage && (
              <p className="text-sm text-muted-foreground italic">
                &quot;{item.statusMessage}&quot;
              </p>
            )}
          </div>

          {item.imageUrl && (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border">
              <Image
                src={item.imageUrl}
                alt="Workout proof"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center gap-4">
          <button
            onClick={handleTogglePowerup}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase italic tracking-widest transition-all active:scale-95",
              hasPowerup
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
            )}
          >
            <LightningIcon
              weight={hasPowerup ? "fill" : "duotone"}
              className="size-4"
            />
            POWERUP {powerupsCount > 0 && <span>({powerupsCount})</span>}
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase italic tracking-widest bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all active:scale-95">
            <ChatTeardropIcon weight="duotone" className="size-4" />
            Comentar
          </button>
        </div>
      </div>
    </article>
  );
}
