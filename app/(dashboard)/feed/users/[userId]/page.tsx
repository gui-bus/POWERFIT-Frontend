import { 
  getUserFeed, 
  getUserFeedResponseSuccess, 
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { PageHeader } from "@/components/pageHeader";
import { Container } from "@/components/common/container";
import { FeedList } from "@/components/feed/feedList";
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

  const feedResponse = await getUserFeed(userId, { limit: 5 });

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

  const { data } = feedResponse as getUserFeedResponseSuccess;
  
  // Try to get user info from first feed item if available
  const userProfile = data.activities.length > 0 ? {
    name: data.activities[0].userName,
    image: data.activities[0].userImage,
  } : null;

  return (
    <Container className="space-y-12 pb-24">
      <header className="flex items-center gap-6">
        <Link href="/feed">
          <button className="p-4 bg-card border border-border hover:border-primary/50 rounded-[1.5rem] transition-all active:scale-90 group shadow-sm">
            <CaretLeftIcon weight="bold" className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </Link>
        <PageHeader
          title="PERFIL"
          subtitle={userProfile ? `Atividades de ${userProfile.name}` : "Histórico de atleta"}
        />
      </header>

      <div className="w-full space-y-8">
        {/* Profile Card */}
        {userProfile && (
          <div className="bg-card border border-border rounded-[3rem] p-8 flex flex-col sm:flex-row items-center gap-8 shadow-sm  relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <ActivityIcon weight="fill" className="size-32 text-primary" />
            </div>
            
            <Avatar className="size-32 border-4 border-primary/10 shadow-2xl rounded-[2.5rem] relative z-10 group-hover:scale-105 transition-transform duration-500">
              <AvatarImage src={userProfile.image || ""} alt={userProfile.name} className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground font-black text-4xl uppercase italic">
                {userProfile.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-4 text-center sm:text-left relative z-10">
              <div className="space-y-1">
                <h3 className="text-3xl font-black uppercase italic tracking-tight text-foreground">{userProfile.name}</h3>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-primary">
                  <ActivityIcon weight="duotone" className="size-5" />
                  <p className="text-xs font-black uppercase italic tracking-widest">
                    Atleta PowerFit
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-xl font-black italic text-foreground leading-none">{data.activities.length}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">Treinos</p>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block" />
                <div className="text-center sm:text-left">
                  <p className="text-xl font-black italic text-primary leading-none">--</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">Nível</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <FeedList 
          initialItems={data.activities} 
          initialNextCursor={data.nextCursor} 
          userId={userId}
        />
      </div>
    </Container>
  );
}
