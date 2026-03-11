import { 
  getFeed, 
  getFeedResponseSuccess, 
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/pageHeader";
import { Container } from "@/components/common/container";
import { FeedList } from "@/components/feed/feedList";
import { UserPlusIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

export default async function FeedPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");


  const feedRes = await getFeed({ limit: 5 });

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

  const { data } = feedRes as getFeedResponseSuccess;

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

      <FeedList 
        initialItems={data.activities} 
        initialNextCursor={data.nextCursor} 
      />

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
