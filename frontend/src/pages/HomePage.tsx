import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import { getOutgoingFriendRequests, getRecommendedUsers, getUserFriends, sendFriendRequest } from "../api/user.api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import UserFriendsSkeleton from "../components/skeletons/UserFriendsSkeleton";
import FriendCard, { getLanguageFlag } from "../components/home/FriendsCard";
import NoFriendsFound from "../components/home/NoFriendsFound";
import RecommendedUsersSkeleton from "../components/skeletons/RecommendedUsersSkeleton";
import { capitalize } from "../lib/utils";

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

  const {data:outgoingFriendRequests=[]} = useQuery({
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
      outgoingFriendRequests.forEach((request) => outgoingIds.add(request.receiver._id));
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendRequests]);

  return (
    <div className="p-3 sm:p-5 lg:p-7">
      <div className="container mx-auto space-y-8.5">
        {error && <div className="alert alert-error">{error.message}</div>}

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

        {/* Recommended Users */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {isRecommendedUsersLoading ? (
            <RecommendedUsersSkeleton />
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {recommendedUsers.map((user) => {
                const hasRequestSent = outgoingRequestsIds.has(user._id);
                return (
                  <div key={user._id} className="card bg-base-200 hover:shadow-lg transition-all duration-300">
                    <div className="card-body p-4 space-y-3">
                      {/* body-top */}
                      <div className="flex items-center gap-3">
                        <div className="avatar size-15 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} className="w-12 h-12 rounded-full"/>
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Languages */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitalize(user.learningLanguage)}
                        </span>
                      </div>

                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => friendRequest(user._id)}
                        disabled={hasRequestSent || isPending}
                      >
                        {hasRequestSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>  
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default HomePage