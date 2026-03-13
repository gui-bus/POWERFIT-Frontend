"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChatTeardropIcon, 
  PaperPlaneRightIcon, 
  DotsThreeVerticalIcon, 
  PencilSimpleIcon, 
  TrashIcon, 
  XIcon,
  CheckIcon
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { formatRelativeTime } from "@/lib/utils/date";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdownMenu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { editComment, deleteComment, deleteAdminCommentsId } from "@/lib/api/fetch-generated";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
import { ShieldIcon } from "@phosphor-icons/react/ssr";

interface Comment {
  id: string;
  userId: string;
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
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const onUpdateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editText.trim() || isUpdating) return;

    setIsUpdating(true);
    try {
      const response = await editComment(editingId, { content: editText });
      if (response.status === 204) {
        toast.success("Comentário atualizado!");
        setEditingId(null);
        router.refresh();
      }
    } catch {
      toast.error("Erro ao editar comentário.");
    } finally {
      setIsUpdating(false);
    }
  };

  const onDeleteComment = async (commentId: string, isAuthor: boolean) => {
    try {
      const response = isAuthor 
        ? await deleteComment(commentId)
        : await deleteAdminCommentsId(commentId);

      if (response.status === 204) {
        toast.success(isAuthor ? "Comentário removido." : "Comentário removido pela moderação.");
        router.refresh();
      }
    } catch {
      toast.error("Erro ao deletar comentário.");
    }
  };

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
            {comments.map((comment) => {
              const isAuthor = session?.user?.id === comment.userId;
              const canModerate = isAuthor || isAdmin;

              return (
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
                  <div className={`bg-muted/50 rounded-2xl rounded-tl-none p-3 flex-1 border relative group/comment ${isAdmin && !isAuthor ? 'border-primary/20 bg-primary/[0.02]' : 'border-border/30'}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black uppercase italic text-foreground">
                          {comment.userName}
                        </p>
                        {isAdmin && !isAuthor && (
                          <ShieldIcon weight="duotone" className="size-3 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-[8px] font-bold text-muted-foreground uppercase">
                          {formatRelativeTime(comment.createdAt)}
                        </p>
                        
                        {canModerate && !editingId && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="opacity-0 group-hover/comment:opacity-100 transition-opacity p-1 hover:text-primary cursor-pointer">
                                <DotsThreeVerticalIcon weight="bold" className="size-3" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card border-border rounded-xl p-1.5 min-w-32">
                              {isAuthor && (
                                <DropdownMenuItem 
                                  onClick={() => handleEdit(comment)}
                                  className="rounded-lg text-[9px] font-black uppercase italic tracking-widest gap-2 py-2 cursor-pointer"
                                >
                                  <PencilSimpleIcon weight="bold" className="size-3.5 text-primary" />
                                  Editar
                                </DropdownMenuItem>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="rounded-lg text-[9px] font-black uppercase italic tracking-widest gap-2 py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                  >
                                    <TrashIcon weight="bold" className="size-3.5" />
                                    {isAuthor ? "Excluir" : "Moderar (Remover)"}
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-card border-border rounded-[2rem]">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-anton italic uppercase">
                                      {isAuthor ? "Remover Comentário" : "Moderação: Remover Comentário"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-xs font-medium text-muted-foreground">
                                      {isAuthor 
                                        ? "Deseja deletar permanentemente este comentário?"
                                        : "Como administrador, você está prestes a remover o comentário deste usuário. Esta ação não pode ser desfeita."}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="gap-2">
                                    <AlertDialogCancel className="rounded-xl font-black uppercase italic tracking-widest text-[9px] h-10 border-border cursor-pointer">Voltar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => onDeleteComment(comment.id, isAuthor)}
                                      className="bg-destructive hover:bg-red-600 text-white rounded-xl font-black uppercase italic tracking-widest text-[9px] h-10 px-6 cursor-pointer"
                                    >
                                      Deletar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>

                    {editingId === comment.id ? (
                      <form onSubmit={onUpdateComment} className="mt-2 space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-background border border-primary/30 rounded-xl p-3 text-xs font-medium focus:outline-hidden min-h-20 resize-none italic"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          >
                            <XIcon weight="bold" className="size-4" />
                          </button>
                          <button
                            type="submit"
                            disabled={isUpdating || !editText.trim()}
                            className="bg-primary text-primary-foreground p-2 rounded-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {isUpdating ? (
                              <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <CheckIcon weight="bold" className="size-4" />
                            )}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
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

          {!editingId && (
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
                  className="absolute right-1.5 top-1.5 size-9 bg-primary text-primary-foreground flex items-center justify-center rounded-[0.6rem] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                >
                  <PaperPlaneRightIcon weight="fill" className="size-4" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
