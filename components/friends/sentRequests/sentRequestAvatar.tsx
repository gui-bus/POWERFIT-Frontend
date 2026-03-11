import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SentRequestAvatarProps {
  name: string;
  image?: string | null;
}

export function SentRequestAvatar({ name, image }: SentRequestAvatarProps) {
  return (
    <Avatar className="size-10 border border-border rounded-xl">
      <AvatarImage src={image || ""} className="object-cover" />
      <AvatarFallback className="bg-muted text-[10px] font-bold">
        {name.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
