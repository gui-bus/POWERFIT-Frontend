import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils/date";

interface FeedHeaderProps {
  userName: string;
  userImage?: string | null;
  completedAt: string;
  workoutDayName: string;
}

export function FeedHeader({ userName, userImage, completedAt, workoutDayName }: FeedHeaderProps) {
  const timeAgo = formatRelativeTime(completedAt);

  return (
    <div className="p-6 sm:p-8 pb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="size-12 border-2 border-border shadow-sm transition-colors rounded-full">
            <AvatarImage
              src={userImage || ""}
              alt={userName}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-black uppercase italic rounded-full">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 border-2 border-card rounded-full" />
        </div>
        <div>
          <h3 className="text-base font-black uppercase italic tracking-tight text-foreground">
            {userName}
          </h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-muted-foreground">
            <p className="text-[10px] font-bold uppercase tracking-widest">
              {timeAgo}
            </p>
            <span className="text-[10px] opacity-30">•</span>
            <p className="text-[10px] font-bold uppercase tracking-widest">
              TREINO <span className="italic">{workoutDayName}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
