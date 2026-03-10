import { 
  getFriends, 
  getFriendRequests, 
  getMe, 
  getFriendsResponseSuccess,
  getFriendRequestsResponseSuccess,
  getMeResponseSuccess,
  GetFriendRequestsType
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/pageHeader";
import { Container } from "@/components/common/container";
import { FriendsList } from "@/components/friends/friendsList";
import { FriendRequests } from "@/components/friends/friendRequests";
import { FriendSentRequests } from "@/components/friends/friendSentRequests";
import { AddFriendForm } from "@/components/friends/addFriendForm";
import { GlobalSearch } from "@/components/friends/globalSearch";
import { ActivityIcon } from "@phosphor-icons/react/ssr";

export default async function FriendsPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const [friendsRes, requestsRes, sentRequestsRes, meRes] = await Promise.all([
    getFriends(),
    getFriendRequests({ type: GetFriendRequestsType.RECEIVED }),
    getFriendRequests({ type: GetFriendRequestsType.SENT }),
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
  const sentRequests = sentRequestsRes.status === 200 ? (sentRequestsRes as getFriendRequestsResponseSuccess).data : [];
  const { data: me } = meRes as getMeResponseSuccess;

  return (
    <Container className="space-y-12 pb-24">
      <header className="space-y-10">
        <PageHeader
          title="CONEXÕES"
          subtitle="Busque e gerencie sua rede"
          user={{
            name: me.name,
            email: me.email,
            image: me.image,
          }}
        />
        
        <GlobalSearch />
      </header>

      <div className="w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <AddFriendForm myFriendCode={me.friendCode} />
          </div>
          <div className="md:col-span-3 space-y-8">
            <FriendRequests requests={requests} />
            <FriendSentRequests requests={sentRequests} />
            
            {requests.length === 0 && sentRequests.length === 0 && (
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
