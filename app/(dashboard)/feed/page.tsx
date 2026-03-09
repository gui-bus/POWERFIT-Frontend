import { 
  getFeed, 
  getFeedResponseSuccess, 
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/pageHeader";
import { Container } from "@/components/common/container";
import { FeedItem } from "@/components/feed/feedItem";
import { UsersIcon, UserPlusIcon, PlusIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

export default async function FeedPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const feedRes = await getFeed();

  if (feedRes.status !== 200) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-[2.5rem]">
          <p className="text-muted-foreground font-medium italic uppercase tracking-tighter">
            Erro ao carregar o feed de atividades.
          </p>
        </div>
      </Container>
    );
  }

  const { data: feedItems } = feedRes as getFeedResponseSuccess;

  return (
    <Container className="space-y-12 pb-24">
      <header className="flex items-center justify-between gap-6">
        <PageHeader
          title="COMUNIDADE"
          subtitle="Acompanhe o progresso da sua rede"
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />
      </header>

      <div className="max-w-3xl mx-auto w-full space-y-8">
        {feedItems.length > 0 ? (
          <div className="flex flex-col gap-8">
            {feedItems.map((item) => (
              <FeedItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-center bg-card/50 border border-dashed border-border rounded-[3rem] space-y-8">
            <div className="relative">
              <div className="size-24 bg-muted rounded-full flex items-center justify-center">
                <UsersIcon weight="duotone" className="size-12 text-muted-foreground" />
              </div>
              <div className="absolute -bottom-2 -right-2 size-10 bg-primary rounded-full flex items-center justify-center shadow-lg text-primary-foreground">
                <PlusIcon weight="bold" className="size-5" />
              </div>
            </div>
            
            <div className="space-y-3 max-w-sm mx-auto">
              <h3 className="text-2xl font-black uppercase italic tracking-tight">O feed está em silêncio</h3>
              <p className="text-sm text-muted-foreground font-medium">
                Sua rede de atletas ainda não registrou atividades hoje. Que tal ser o primeiro a postar um treino?
              </p>
            </div>

            <Link href="/friends">
              <button className="bg-primary text-primary-foreground px-10 py-5 rounded-[1.5rem] font-black uppercase italic tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                <UserPlusIcon weight="bold" className="size-4" />
                Encontrar Atletas
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Action Button */}
      <div className="lg:hidden fixed bottom-28 right-6 z-40">
        <Link href="/friends">
          <button className="size-16 bg-primary text-primary-foreground rounded-[1.5rem] shadow-2xl flex items-center justify-center active:scale-90 transition-transform group">
            <UserPlusIcon weight="bold" className="size-7 group-hover:scale-110 transition-transform" />
          </button>
        </Link>
      </div>
    </Container>
  );
}
