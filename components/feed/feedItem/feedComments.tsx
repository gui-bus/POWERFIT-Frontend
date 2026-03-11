import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatTeardropIcon, PaperPlaneRightIcon } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { formatRelativeTime } from "@/lib/utils/date";

interface Comment {
  id: string;
  userName: string;
  userImage?: string | null;
  content: string;
  createdAt: string;
}

interface FeedCommentsProps {
  comments: Comment[];
  showComments: boolean;
  commentText: string;
  isSubmittingComment: boolean;
  onCommentTextChange: (text: string) => void;
  onSubmitComment: (e: React.FormEvent) => void;
}

export function FeedComments({
  comments,
  showComments,
  commentText,
  isSubmittingComment,
  onCommentTextChange,
  onSubmitComment,
}: FeedCommentsProps) {
  return (
    <AnimatePresence>
      {showComments && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden pt-2 space-y-6 px-6 sm:px-8 pb-8"
        >
          <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
            {comments.map((comment) => (
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
            {comments.length === 0 && (
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

          <form onSubmit={onSubmitComment} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => onCommentTextChange(e.target.value)}
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
  );
}
