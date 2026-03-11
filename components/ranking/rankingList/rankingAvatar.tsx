import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RankingAvatarProps {
  name: string;
  image?: string | null;
  isCurrentUser: boolean;
}

export function RankingAvatar({ name, image, isCurrentUser }: RankingAvatarProps) {
  return (
    <div className="relative">
      <Avatar className="size-12 rounded-full border border-border shadow-sm">
        <AvatarImage src={image || ""} alt={name} className="object-cover" />
        <AvatarFallback className="bg-muted text-xs font-black uppercase">
          {name.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      {isCurrentUser && (
        <div className="absolute -top-1 -right-1 size-4 bg-primary rounded-full border-2 border-background animate-pulse" />
      )}
    </div>
  );
}
