import { getFeed, getFeedResponseSuccess } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/pageHeader";
import { Container } from "@/components/common/container";
import { FeedItem } from "@/components/feed/feedItem";
import { UsersIcon, UserPlusIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

export default async function FeedPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const feedResponse = await getFeed();

  if (feedResponse.status !== 200) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-[2.5rem]">
          <p className="text-muted-foreground font-medium italic uppercase tracking-tighter">
            Erro ao carregar o feed.
          </p>
        </div>
      </Container>
    );
  }

  const { data: feedItems } = feedResponse as getFeedResponseSuccess;

  return (
    <Container className="space-y-12">
      <header className="flex items-center justify-between gap-6">
        <PageHeader
          title="FEED"
          subtitle="Atividades da sua rede"
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />

        <Link href="/friends">
          <button className="hidden sm:flex items-center gap-2 px-6 py-3 bg-card border border-border hover:border-primary/50 rounded-2xl text-[10px] font-black uppercase italic tracking-widest transition-all active:scale-95 group">
            <UsersIcon
              weight="duotone"
              className="size-4 text-primary group-hover:scale-110 transition-transform"
            />
            Amigos
          </button>
        </Link>
      </header>

      <div className="w-full space-y-8">
        {feedItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {feedItems.map((item) => (
              <FeedItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-card/50 border border-dashed border-border rounded-[3rem] space-y-6">
            <div className="size-20 bg-muted rounded-full flex items-center justify-center">
              <UserPlusIcon
                weight="duotone"
                className="size-10 text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase italic tracking-tight">
                O feed está vazio
              </h3>
              <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">
                Adicione amigos para ver suas atividades de treino e dar aquele
                Powerup!
              </p>
            </div>
            <Link href="/friends">
              <button className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Encontrar Amigos
              </button>
            </Link>
          </div>
        )}
      </div>

      <div className="sm:hidden fixed bottom-24 right-6 z-40">
        <Link href="/friends">
          <button className="size-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform">
            <UsersIcon weight="bold" className="size-6" />
          </button>
        </Link>
      </div>
    </Container>
  );
}
