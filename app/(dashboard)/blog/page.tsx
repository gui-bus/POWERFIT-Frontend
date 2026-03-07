import Link from "next/link";
import Image from "next/image";
import { BookOpenIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";

const MOCK_POSTS = [
  {
    id: 1,
    slug: "hipertrofia-maxima",
    title: "Hipertrofia Máxima: A ciência por trás das repetições",
    category: "Treinamento",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    description: "Entenda os mecanismos fisiológicos que levam ao crescimento muscular e como otimizar seu volume de treino."
  },
  {
    id: 2,
    slug: "nutricao-peri-treino",
    title: "Nutrição Peri-treino: O que comer antes e depois",
    category: "Dieta",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
    description: "O guia definitivo sobre o que consumir ao redor da sua janela de treino para performance e recuperação."
  },
  {
    id: 3,
    slug: "sono-e-performance",
    title: "Sono e Performance: O anabolizante natural",
    category: "Recovery",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=800",
    description: "Descubra por que o descanso é o fator mais negligenciado na busca pelo corpo ideal."
  },
  {
    id: 4,
    slug: "mobilidade-articular",
    title: "Mobilidade Articular: Base para Força",
    category: "Mobilidade",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800",
    description: "Melhore sua amplitude de movimento e previna lesões com estas técnicas de mobilidade ativa."
  }
];

export default async function BlogListingPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  return (
    <Container className="space-y-16">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <PageHeader 
          title="BLOG" 
          subtitle="Central de Conhecimento" 
          user={session.data?.user ? {
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          } : undefined}
        />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_POSTS.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group">
            <article className="bg-card border border-border rounded-[3rem] overflow-hidden flex flex-col h-full hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-background/90 backdrop-blur-md text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 rounded-xl border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-4 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                  <BookOpenIcon weight="duotone" className="size-4" />
                  <span>{post.readTime} DE LEITURA</span>
                </div>
                <h2 className="text-2xl font-black italic uppercase leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                  {post.description}
                </p>
                <div className="pt-4 mt-auto">
                  <Button variant="ghost" className="p-0 h-auto font-black italic uppercase tracking-widest text-[11px] group-hover:text-primary gap-2">
                    Ler Artigo Completo
                    <ArrowRightIcon weight="duotone" className="size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </Container>
  )
}
