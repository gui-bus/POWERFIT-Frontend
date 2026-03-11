import Image from "next/image";
import { UsersIcon } from "@phosphor-icons/react";

interface FeedBodyProps {
  statusMessage?: string | null;
  imageUrl?: string | null;
  taggedUsers: { id: string; name: string }[];
}

export function FeedBody({ statusMessage, imageUrl, taggedUsers }: FeedBodyProps) {
  return (
    <div className="space-y-4">
      <div className="px-6 sm:px-8 space-y-3">
        {statusMessage && (
          <p className="text-sm italic leading-relaxed">
            {statusMessage}
          </p>
        )}

        {taggedUsers.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <UsersIcon weight="duotone" className="size-3.5 text-primary" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Com{" "}
              {taggedUsers.map((user, index) => (
                <span key={user.id} className="text-foreground">
                  {user.name.split(" ")[0]}
                  {index < taggedUsers.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="relative aspect-square sm:aspect-16/10 w-full overflow-hidden group-hover:border-primary/10 transition-colors shadow-inner bg-muted/20">
          <Image
            src={imageUrl}
            alt="Workout proof"
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
