"use client";

import { 
  GetFeed200Item, 
  togglePowerup, 
  addComment, 
  GetFeed200ItemCommentsItem 
} from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LightningIcon, 
  ChatTeardropIcon, 
  DotsThreeVerticalIcon, 
  TrendUpIcon,
  CalendarIcon,
  PaperPlaneRightIcon,
  UsersIcon
} from "@phosphor-icons/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/lib/utils/animations";
import { toast } from "sonner";

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
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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
      setHasPowerup(previousHasPowerup);
      setPowerupsCount(previousPowerupsCount);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await addComment(item.id, { content: commentText });
      if (response.status === 204) {
        setCommentText("");
        toast.success("Comentário adicionado!");
        router.refresh();
      }
    } catch (error) {
      toast.error("Erro ao adicionar comentário.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const timeAgo = dayjs(item.completedAt).fromNow();

  return (
    <motion.article 
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group"
    >
      <div className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="size-12 border-2 border-border shadow-sm group-hover:border-primary/50 transition-colors rounded-2xl">
                <AvatarImage src={item.userImage || ""} alt={item.userName} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-black uppercase italic rounded-2xl">
                  {item.userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 border-2 border-card rounded-full" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase italic tracking-tight text-foreground group-hover:text-primary transition-colors">
                {item.userName}
              </h3>
              <div className="flex items-center gap-2">
                <CalendarIcon weight="bold" className="size-3 text-muted-foreground" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {timeAgo}
                </p>
              </div>
            </div>
          </div>
          
          <button className="size-10 flex items-center justify-center rounded-2xl hover:bg-muted transition-colors">
            <DotsThreeVerticalIcon weight="bold" className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-3xl p-5 border border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <TrendUpIcon weight="fill" className="size-16 text-primary" />
            </div>
            
            <p className="text-sm font-medium text-foreground leading-relaxed relative z-10">
              Completou o treino <span className="text-primary font-black italic uppercase">{item.workoutDayName}</span> 
              {" "}do plano <span className="font-black italic uppercase tracking-tighter opacity-80">{item.workoutPlanName}</span>.
            </p>

            {item.taggedUsers.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <UsersIcon weight="duotone" className="size-3.5 text-primary" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Treinou com{" "}
                  {item.taggedUsers.map((user, index) => (
                    <span key={user.id} className="text-foreground">
                      {user.name.split(' ')[0]}
                      {index < item.taggedUsers.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>
            )}
            
            {item.statusMessage && (
              <div className="mt-3 relative z-10">
                <p className="text-sm text-muted-foreground italic pl-4 border-l-2 border-primary/30 py-1 bg-primary/5 rounded-r-lg">
                  &quot;{item.statusMessage}&quot;
                </p>
              </div>
            )}
          </div>

          {item.imageUrl && (
            <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-border group-hover:border-primary/20 transition-colors shadow-lg">
              <Image
                src={item.imageUrl}
                alt="Workout proof"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleTogglePowerup}
            disabled={isLoading}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-[0.15em] transition-all active:scale-95",
              hasPowerup
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
            )}
          >
            <LightningIcon weight={hasPowerup ? "fill" : "duotone"} className="size-5" />
            POWERUP {powerupsCount > 0 && <span className="ml-1 opacity-80">({powerupsCount})</span>}
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-[0.15em] transition-all active:scale-95 border border-transparent hover:border-primary/20 group/comment",
              showComments ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
            )}
          >
            <ChatTeardropIcon weight="duotone" className="size-5 group-hover/comment:rotate-12 transition-transform" />
            Comentários {item.comments.length > 0 && <span className="ml-1 opacity-80">({item.comments.length})</span>}
          </button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-4 border-t border-border/50 space-y-6"
            >
              <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {item.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="size-8 rounded-xl shrink-0">
                      <AvatarImage src={comment.userImage || ""} />
                      <AvatarFallback className="text-[10px] font-bold">{comment.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/50 rounded-2xl rounded-tl-none p-3 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-[10px] font-black uppercase italic text-foreground">{comment.userName}</p>
                        <p className="text-[8px] font-bold text-muted-foreground uppercase">{dayjs(comment.createdAt).fromNow()}</p>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {item.comments.length === 0 && (
                  <p className="text-center py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Nenhum comentário ainda. Seja o primeiro!</p>
                )}
              </div>

              {/* Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva um comentário..."
                  className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-xs font-medium focus:outline-hidden focus:border-primary/50 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={isSubmittingComment || !commentText.trim()}
                  className="bg-primary text-primary-foreground size-10 flex items-center justify-center rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <PaperPlaneRightIcon weight="fill" className="size-5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
