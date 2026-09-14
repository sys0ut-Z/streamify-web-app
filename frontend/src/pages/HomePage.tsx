import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import { getOutgoingFriendRequests, getRecommendedUsers, getUserFriends, sendFriendRequest } from "../api/user.api";
import { Link } from "react-router";
import { UsersIcon } from "lucide-react";
import UserFriendsSkeleton from "../components/skeletons/UserFriendsSkeleton";
import FriendCard from "../components/home/FriendsCard";
import NoFriendsFound from "../components/home/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set<string>());

  const {data:friends=[], isLoading:isFriendsLoading} = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends
  });

  const {data:recommendedUsers=[], isLoading:isRecommendedUsersLoading} = useQuery({
    queryKey: ['recommendedUsers'],
    queryFn: getRecommendedUsers
  });

  const {data:outgoingFriendRequests=[], isLoading:isOutgoingFriendRequestsLoading} = useQuery({
    queryKey: ['outgoingFriendRequests'],
    queryFn: getOutgoingFriendRequests
  });

  const {mutate:friendRequest, isPending, error} = useMutation({
    mutationFn: (recipientId: string) => sendFriendRequest(recipientId),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['outgoingFriendRequests']})
  });

  // ^ when the user sends friend request to another user, we will update it in outgoing requests ids
  useEffect(() => {
    const outgoingIds = new Set<string>();
    if(outgoingFriendRequests.length > 0) {
      outgoingFriendRequests.forEach((request) => outgoingIds.add(request._id));
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendRequests]);

  return (
    <div className="p-3 sm:p-5 lg:p-7">
      <div className="container mx-auto space-y-8.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {isFriendsLoading ? (
          // TODO : create skeleton UI
          <UserFriendsSkeleton />
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {friends?.map((friend) => (
              <FriendCard key={friend._id} friend={friend}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage