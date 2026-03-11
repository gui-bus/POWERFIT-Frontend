import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { GetFriends200Item } from "@/lib/api/fetch-generated";

interface TagFriendsSectionProps {
  friends: GetFriends200Item[];
  selectedFriends: string[];
  onToggleFriend: (id: string) => void;
}

export function TagFriendsSection({ friends, selectedFriends, onToggleFriend }: TagFriendsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <UsersIcon weight="duotone" className="size-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Treinou com alguém?</span>
        </div>
        {selectedFriends.length > 0 && (
          <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">
            {selectedFriends.length} marcados
          </span>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar mask-fade-right p-1">
        {friends.length > 0 ? (
          friends.map((friend) => {
            const isSelected = selectedFriends.includes(friend.id);
            return (
              <button
                key={friend.id}
                onClick={() => onToggleFriend(friend.id)}
                className="flex flex-col items-center gap-2 group shrink-0 cursor-pointer"
              >
                <div className={cn(
                  "relative size-14 rounded-2xl p-0.5 transition-all duration-300",
                  isSelected ? "bg-primary shadow-lg shadow-primary/20 scale-110" : "bg-border/50 hover:bg-primary/30"
                )}>
                  <div className="size-full rounded-[0.9rem] bg-card overflow-hidden">
                    <Avatar className="size-full rounded-none">
                      <AvatarImage src={friend.image || ""} className="object-cover" />
                      <AvatarFallback className="text-[10px] font-bold">{friend.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 size-5 bg-primary text-white rounded-full flex items-center justify-center border-2 border-card shadow-sm">
                      <CheckIcon weight="bold" className="size-2.5" />
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-tighter max-w-15 truncate transition-colors",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}>
                  {friend.name.split(' ')[0]}
                </span>
              </button>
            );
          })
        ) : (
          <p className="text-[9px] font-bold text-muted-foreground italic px-1 uppercase tracking-widest py-4">Nenhum amigo para marcar.</p>
        )}
      </div>
    </div>
  );
}
