"use client";

import {
  GetFeed200ActivitiesItem,
  togglePowerup,
  addComment,
} from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LightningIcon,
  ChatTeardropIcon,
  PaperPlaneRightIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/lib/utils/animations";
import { toast } from "sonner";
import { formatRelativeTime } from "@/lib/utils/date";

import { authClient } from "@/lib/authClient";

interface FeedItemProps {
  item: GetFeed200ActivitiesItem;
}

export function FeedItem({ item }: FeedItemProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  const [hasPowerup, setHasPowerup] = useState(item.hasPowerupByMe);
  const [powerupsCount, setPowerupsCount] = useState(item.powerupsCount);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOwnPost = mounted && session?.user?.id === item.userId;

  const handleTogglePowerup = async () => {
    if (isLoading || isOwnPost) return;
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
      console.error(error);
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
      console.error(error);
      toast.error("Erro ao adicionar comentário.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const timeAgo = formatRelativeTime(item.completedAt);

  return (
    <motion.article
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="bg-card border border-border rounded-[2.5rem] overflow-hidden group"
    >
      {/* Header */}
      <div className="p-6 sm:p-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-12 border-2 border-border shadow-sm transition-colors rounded-full">
              <AvatarImage
                src={item.userImage || ""}
                alt={item.userName}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary font-black uppercase italic rounded-full">
                {item.userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 border-2 border-card rounded-full" />
          </div>
          <div>
            <h3 className="text-base font-black uppercase italic tracking-tight text-foreground">
              {item.userName}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-muted-foreground">
              <p className="text-[10px] font-bold uppercase tracking-widest">
                {timeAgo}
              </p>
              <span className="text-[10px] opacity-30">•</span>
              <p className="text-[10px] font-bold uppercase tracking-widest">
                TREINO <span className="italic">{item.workoutDayName}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Post Body */}
      <div className="space-y-4">
        {/* Text Content */}
        <div className="px-6 sm:px-8 space-y-3">
          {item.statusMessage && (
            <p className="text-sm italic leading-relaxed">
              {item.statusMessage}
            </p>
          )}

          {item.taggedUsers.length > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <UsersIcon weight="duotone" className="size-3.5 text-primary" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Com{" "}
                {item.taggedUsers.map((user, index) => (
                  <span key={user.id} className="text-foreground">
                    {user.name.split(" ")[0]}
                    {index < item.taggedUsers.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>

        {/* Media Content */}
        {item.imageUrl && (
          <div className="relative aspect-square sm:aspect-16/10 w-full overflow-hidde group-hover:border-primary/10 transition-colors shadow-inner bg-muted/20">
            <Image
              src={item.imageUrl}
              alt="Workout proof"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Interactions Footer */}
      <div className="p-6 sm:p-8 pt-4 space-y-6">
        {/* Counts / Stats */}
        {(powerupsCount > 0 || item.comments.length > 0) && (
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center gap-1.5">
              <div className="size-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <LightningIcon
                  weight="fill"
                  className="size-3 text-primary-foreground"
                />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {powerupsCount} Powerups
              </span>
            </div>
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors"
            >
              {item.comments.length} Comentários
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePowerup}
            disabled={isLoading || isOwnPost}
            title={
              isOwnPost ? "Você não pode dar Powerup no seu próprio treino" : ""
            }
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-[0.15em] transition-all active:scale-95 border border-transparent",
              hasPowerup
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
              isOwnPost && "opacity-50 cursor-not-allowed grayscale",
            )}
          >
            <LightningIcon
              weight={hasPowerup ? "fill" : "duotone"}
              className="size-5"
            />
            {hasPowerup ? "POWERUP!" : "POWERUP"}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-[0.15em] transition-all active:scale-95 border border-transparent group/comment cursor-pointer",
              showComments
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
            )}
          >
            <ChatTeardropIcon weight="duotone" className="size-5" />
            Comentar
          </button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-2 space-y-6"
            >
              <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                {item.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 animate-in slide-in-from-left duration-300"
                  >
                    <Avatar className="size-8 rounded-xl shrink-0">
                      <AvatarImage src={comment.userImage || ""} />
                      <AvatarFallback className="text-[10px] font-bold">
                        {comment.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/50 rounded-2xl rounded-tl-none p-3 flex-1 border border-border/30">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-[10px] font-black uppercase italic text-foreground">
                          {comment.userName}
                        </p>
                        <p className="text-[8px] font-bold text-muted-foreground uppercase">
                          {formatRelativeTime(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
                {item.comments.length === 0 && (
                  <div className="text-center py-8 opacity-50">
                    <ChatTeardropIcon
                      weight="duotone"
                      className="size-8 mx-auto mb-2 text-muted-foreground"
                    />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
                      Nenhum comentário ainda.
                    </p>
                  </div>
                )}
              </div>

              {/* Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Adicione um comentário..."
                    className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-xs font-medium focus:outline-hidden focus:border-primary/50 transition-colors pr-12"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="absolute right-1.5 top-1.5 size-9 bg-primary text-primary-foreground flex items-center justify-center rounded-[0.6rem] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <PaperPlaneRightIcon weight="fill" className="size-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
