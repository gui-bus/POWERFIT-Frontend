"use client";

import {
  GetFeed200ActivitiesItem,
  togglePowerup,
  addComment,
} from "@/lib/api/fetch-generated";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/utils/animations";
import { toast } from "sonner";
import { authClient } from "@/lib/authClient";
import { FeedHeader } from "./feedItem/feedHeader";
import { FeedBody } from "./feedItem/feedBody";
import { FeedInteractions } from "./feedItem/feedInteractions";
import { FeedComments } from "./feedItem/feedComments";

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

  return (
    <motion.article
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="bg-card border border-border rounded-[2.5rem] overflow-hidden group"
    >
      <FeedHeader
        userName={item.userName}
        userImage={item.userImage}
        completedAt={item.completedAt}
        workoutDayName={item.workoutDayName}
      />

      <FeedBody
        statusMessage={item.statusMessage}
        imageUrl={item.imageUrl}
        taggedUsers={item.taggedUsers}
      />

      <FeedInteractions
        hasPowerup={hasPowerup}
        powerupsCount={powerupsCount}
        commentsCount={item.comments.length}
        isLoading={isLoading}
        isOwnPost={isOwnPost}
        showComments={showComments}
        onTogglePowerup={handleTogglePowerup}
        onToggleComments={() => setShowComments(!showComments)}
      />

      <FeedComments
        comments={item.comments.map(c => ({
          ...c,
          userId: c.userId // Ensuring mapping
        }))}
        showComments={showComments}
        commentText={commentText}
        isSubmittingComment={isSubmittingComment}
        onCommentTextChange={setCommentText}
        onSubmitComment={handleAddComment}
      />
    </motion.article>
  );
}
