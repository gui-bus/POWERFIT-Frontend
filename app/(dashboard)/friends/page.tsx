import { 
  getFriends, 
  getFriendRequests, 
  getMe, 
  getFriendsResponseSuccess,
  getFriendRequestsResponseSuccess,
  getMeResponseSuccess
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/pageHeader";
import { Container } from "@/components/common/container";
import { FriendsList } from "@/components/friends/friendsList";
import { FriendRequests } from "@/components/friends/friendRequests";
import { AddFriendForm } from "@/components/friends/addFriendForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersIcon, ActivityIcon } from "@phosphor-icons/react/ssr";

export default async function FriendsPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const [friendsRes, requestsRes, meRes] = await Promise.all([
    getFriends(),
    getFriendRequests(),
    getMe()
  ]);

  if (friendsRes.status !== 200 || requestsRes.status !== 200 || meRes.status !== 200) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-[2.5rem]">
          <p className="text-muted-foreground font-medium italic uppercase tracking-tighter">
            Erro ao carregar dados de amizades.
          </p>
        </div>
      </Container>
    );
  }

  const { data: friends } = friendsRes as getFriendsResponseSuccess;
  const { data: requests } = requestsRes as getFriendRequestsResponseSuccess;
  const { data: me } = meRes as getMeResponseSuccess;

  return (
    <Container className="space-y-12 pb-24">
      <header>
        <PageHeader
          title="CONEXÕES"
          subtitle="Gerencie sua rede de atletas"
          user={{
            name: me.name,
            email: me.email,
            image: me.image,
          }}
        />
      </header>

      <div className="max-w-4xl mx-auto w-full space-y-12">
        {/* Profile Stats Header - Integrated from Sidebar */}
        <section className="bg-card border border-border rounded-[3rem] p-8 sm:p-10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <UsersIcon weight="fill" className="size-32 text-primary" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <Avatar className="size-28 border-4 border-primary/10 shadow-2xl rounded-[2rem] group-hover:scale-105 transition-transform duration-500">
                <AvatarImage src={me.image || ""} alt={me.name} className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground font-black text-3xl uppercase italic">
                  {me.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 size-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-card shadow-lg">
                <span className="font-anton text-lg text-primary-foreground leading-none">{me.level}</span>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="space-y-1">
                <h3 className="text-3xl font-black uppercase italic tracking-tight text-foreground">{me.name}</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Seu Perfil de Atleta</p>
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-8">
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black italic text-foreground leading-none">{friends.length}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">Amigos</p>
                </div>
                <div className="w-px h-8 bg-border hidden md:block" />
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black italic text-primary leading-none">{me.xp}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">XP Total</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Section: Invite & Requests */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <AddFriendForm myFriendCode={me.friendCode} />
          </div>
          <div className="md:col-span-3">
            <FriendRequests requests={requests} />
            {requests.length === 0 && (
              <div className="bg-muted/30 border border-dashed border-border rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-3 h-full">
                <ActivityIcon weight="duotone" className="size-8 text-muted-foreground/50" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Nenhuma solicitação pendente</p>
              </div>
            )}
          </div>
        </div>

        {/* Friends List Section */}
        <div className="pt-8">
          <FriendsList friends={friends} />
        </div>
      </div>
    </Container>
  );
}
