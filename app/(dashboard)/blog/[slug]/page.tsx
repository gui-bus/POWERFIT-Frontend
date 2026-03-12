import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, TagIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { Metadata } from "next";

const MOCK_POSTS = [
// ... (rest of mock posts)
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = MOCK_POSTS.find((p) => p.slug === slug);
  return { title: post ? `${post.title} | Blog` : "Post do Blog" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = MOCK_POSTS.find((p) => p.slug === slug);

  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-black italic">POST NÃO ENCONTRADO</h1>
        <Link href="/">
          <Button variant="outline" className="rounded-2xl uppercase font-black italic">
            Voltar para o Início
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Container className="space-y-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <PageHeader 
          title="INSIGHTS" 
          subtitle="Ciência & Performance" 
          user={session.data?.user ? {
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          } : undefined}
        />
      </header>

      <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
        <ArrowLeftIcon weight="duotone" className="size-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-xs font-black uppercase tracking-widest italic">Voltar para o Blog</span>
      </Link>

      <article className="space-y-8">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
              <TagIcon weight="duotone" className="size-3" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon weight="duotone" className="size-3" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon weight="duotone" className="size-3" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black italic leading-tight text-foreground uppercase tracking-tight">
            {post.title}
          </h1>
        </header>

        <div className="relative aspect-video w-full overflow-hidden rounded-[3rem] border border-border">
          <Image 
            src={post.image} 
            alt={post.title} 
            fill 
            className="object-cover"
            priority
          />
        </div>

        <div 
          className="prose prose-invert prose-orange max-w-none 
          prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tight
          prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg
          prose-strong:text-foreground prose-strong:font-black
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-3xl prose-blockquote:italic
          prose-img:rounded-[2rem] prose-img:border prose-img:border-border"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <footer className="pt-12 border-t border-border mt-12">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black italic text-2xl">
                P.
              </div>
              <div>
                <p className="text-sm font-black uppercase italic">PowerFit Editorial</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Conteúdo para Atletas de Elite</p>
              </div>
            </div>
            <Link href="/blog">
              <Button className="rounded-2xl uppercase font-black italic px-8 h-12 cursor-pointer">
                Mais Insights
              </Button>
            </Link>
          </div>
        </footer>
      </article>
    </Container>
  );
}
