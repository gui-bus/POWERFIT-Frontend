import { 
  getUserFeed, 
  getUserFeedResponseSuccess, 
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { PageHeader } from "@/components/pageHeader";
import { Container } from "@/components/common/container";
import { FeedItem } from "@/components/feed/feedItem";
import { CaretLeftIcon, ActivityIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserFeedPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserFeedPage({ params }: UserFeedPageProps) {
  const { userId } = await params;
  
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const feedResponse = await getUserFeed(userId);

  if (feedResponse.status !== 200) {
    if ((feedResponse.status as number) === 404) notFound();
    
    return (
      <Container>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-[2.5rem]">
          <p className="text-muted-foreground font-medium italic uppercase tracking-tighter">
            Erro ao carregar o feed do usuário.
          </p>
        </div>
      </Container>
    );
  }

  const { data: feedItems } = feedResponse as getUserFeedResponseSuccess;
  
  // Try to get user info from first feed item if available
  const user = feedItems.length > 0 ? {
    name: feedItems[0].userName,
    image: feedItems[0].userImage,
  } : null;

  return (
    <Container className="space-y-12">
      <header className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/friends">
            <button className="p-3 bg-card border border-border hover:border-primary/50 rounded-2xl transition-all active:scale-90 group">
              <CaretLeftIcon weight="bold" className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </Link>
          <PageHeader
            title="ATIVIDADES"
            subtitle={user ? `Histórico de ${user.name}` : "Histórico de treinos"}
          />
        </div>
      </header>

      <div className="w-full space-y-8">
        {user && (
           <div className="border rounded-[2.5rem] p-8 flex items-center gap-6 shadow-sm border-primary/20 bg-card">
            <Avatar className="size-20 border-2 border-primary/20 shadow-lg rounded-[1.5rem]">
              <AvatarImage src={user.image || ""} alt={user.name} className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground font-black text-2xl uppercase italic rounded-[1.5rem]">
                {user.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-2xl font-black uppercase italic tracking-tight text-foreground">{user.name}</h3>
              <div className="flex items-center gap-2">
                <ActivityIcon weight="duotone" className="size-4 text-primary" />
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                  {feedItems.length} Atividades registradas
                </p>
              </div>
            </div>
          </div>
        )}

        {feedItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {feedItems.map((item) => (
              <FeedItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-card/50 border border-dashed border-border rounded-[3rem] space-y-6">
            <div className="size-20 bg-muted rounded-full flex items-center justify-center">
              <ActivityIcon weight="duotone" className="size-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase italic tracking-tight">Sem atividades</h3>
              <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">
                Este usuário ainda não registrou nenhum treino.
              </p>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
