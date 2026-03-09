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
import { FriendsSidebar } from "@/components/friends/friendsSidebar";

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
    <Container className="space-y-12 pb-20">
      <header>
        <PageHeader
          title="AMIGOS"
          subtitle="Gerencie sua rede de atletas"
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto w-full">
        {/* Left Column: List & Requests */}
        <div className="lg:col-span-2 space-y-12 order-2 lg:order-1">
          <FriendRequests requests={requests} />
          <FriendsList friends={friends} />
        </div>

        {/* Right Column: Profile & Add Friend */}
        <div className="order-1 lg:order-2">
          <FriendsSidebar 
            user={{
              name: session.data.user.name,
              email: session.data.user.email,
              image: session.data.user.image,
            }}
            myFriendCode={me.friendCode}
            friendsCount={friends.length}
          />
        </div>
      </div>
    </Container>
  );
}
