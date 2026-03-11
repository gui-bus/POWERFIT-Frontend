import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FriendRequestAvatarProps {
  name: string;
  image?: string | null;
}

export function FriendRequestAvatar({ name, image }: FriendRequestAvatarProps) {
  return (
    <Avatar className="size-16 border-2 border-primary/20 shadow-lg rounded-2xl group-hover:scale-110 transition-transform duration-300">
      <AvatarImage src={image || ""} alt={name} className="object-cover" />
      <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl uppercase italic rounded-2xl">
        {name.substring(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
