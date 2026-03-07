import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, TagIcon } from "@phosphor-icons/react/ssr";
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
    date: "01 Mar 2024",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200",
    content: `
      <p>A hipertrofia muscular é um processo complexo que envolve a adaptação das fibras musculares ao estresse mecânico e metabólico. Para maximizar os ganhos, é essencial entender como o volume, a intensidade e a frequência do treino interagem.</p>
      
      <h2>O Estresse Mecânico</h2>
      <p>O principal driver da hipertrofia é a tensão mecânica. Quando você levanta cargas pesadas através de uma amplitude de movimento completa, as fibras musculares sofrem micro-lesões que, ao serem reparadas, tornam o músculo maior e mais forte.</p>
      
      <h2>Volume vs. Intensidade</h2>
      <p>Estudos mostram que o volume total de treino (séries x repetições x carga) é o fator mais correlacionado com o crescimento muscular. No entanto, a intensidade (proximidade da falha) é crucial para garantir que as unidades motoras de alto limiar sejam recrutadas.</p>
      
      <blockquote>
        "O sucesso na musculação não vem de fazer coisas extraordinárias, mas de fazer o básico de forma extraordinária por um longo período."
      </blockquote>
      
      <h2>Conclusão</h2>
      <p>Para hipertrofia máxima, foque em progressão de carga, mantenha um volume adequado para cada grupamento muscular e garanta que sua técnica seja impecável para maximizar a tensão no músculo alvo.</p>
    `
  },
  {
    id: 2,
    slug: "nutricao-peri-treino",
    title: "Nutrição Peri-treino: O que comer antes e depois",
    category: "Dieta",
    readTime: "8 min",
    date: "28 Fev 2024",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200",
    content: `
      <p>O que você consome antes, durante e após o treino pode ditar a qualidade da sua performance e a velocidade da sua recuperação.</p>
      
      <h2>Pré-Treino</h2>
      <p>O objetivo principal é fornecer energia e evitar o catabolismo. Carboidratos complexos consumidos 2-3 horas antes do treino garantem estoques de glicogênio cheios. Se a refeição for mais próxima do treino, opte por carboidratos simples de rápida absorção.</p>
      
      <h2>Pós-Treino: A "Janela de Oportunidade"</h2>
      <p>Embora a ideia de uma janela de 30 minutos seja exagerada, a ingestão de proteínas de alta qualidade e carboidratos após o exercício é fundamental para iniciar a síntese proteica e repor as energias.</p>
      
      <h2>Hidratação</h2>
      <p>Não subestime a água. Uma desidratação de apenas 2% pode reduzir sua força significativamente.</p>
    `
  },
  {
    id: 3,
    slug: "sono-e-performance",
    title: "Sono e Performance: O anabolizante natural",
    category: "Recovery",
    readTime: "6 min",
    date: "25 Fev 2024",
    image: "https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=1200",
    content: `
      <p>Você não cresce na academia; você cresce enquanto dorme. O sono é o período mais crítico para a reparação tecidual e regulação hormonal.</p>
      
      <h2>Hormônios e Recuperação</h2>
      <p>Durante o sono profundo, o corpo libera a maior parte do hormônio do crescimento (GH) e regula os níveis de cortisol. A falta de sono crônica pode reduzir a testosterona e aumentar a resistência à insulina.</p>
      
      <h2>Qualidade vs. Quantidade</h2>
      <p>Sete a nove horas são recomendadas, mas a qualidade importa tanto quanto a duração. Evite telas azuis antes de dormir e mantenha o quarto em uma temperatura amena.</p>
    `
  },
  {
    id: 4,
    slug: "mobilidade-articular",
    title: "Mobilidade Articular: Base para Força",
    category: "Mobilidade",
    readTime: "4 min",
    date: "20 Fev 2024",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1200",
    content: `
      <p>Muitas vezes confundida com flexibilidade, a mobilidade é a capacidade de controlar ativamente uma articulação através de sua amplitude de movimento total.</p>
      
      <h2>Por que treinar mobilidade?</h2>
      <p>Articulações móveis permitem uma técnica melhor nos exercícios compostos. Por exemplo, uma boa mobilidade de tornozelo permite um agachamento mais profundo sem arredondar a lombar.</p>
      
      <h2>Rotina Diária</h2>
      <p>Apenas 10 minutos por dia podem prevenir lesões crônicas e melhorar sua produção de força a longo prazo.</p>
    `
  }
];

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
