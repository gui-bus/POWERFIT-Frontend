import Image from "next/image";
import Link from "next/link";
import { BookOpenIcon } from "@phosphor-icons/react/ssr";

interface BlogCardProps {
  post: {
    id: number;
    slug: string;
    title: string;
    category: string;
    readTime: string;
    image: string;
  };
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article
        className="group bg-background dark:bg-zinc-800 rounded-[2.5rem] border border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden flex items-center"
      >
        <div className="relative aspect-square size-32 min-w-32 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-6 flex flex-col flex-1 justify-between gap-2">
          <div className="space-y-2">
            <span className="text-[8px] font-black text-primary uppercase tracking-widest px-2 py-1 rounded-md bg-primary/10 w-fit block">
              {post.category}
            </span>
            <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 text-foreground">
              {post.title}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpenIcon weight="duotone" className="size-3" />
            <span className="text-[9px] font-black uppercase tracking-widest">{post.readTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
