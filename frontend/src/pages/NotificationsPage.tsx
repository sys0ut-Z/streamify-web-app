import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { acceptFriendRequest, getFriendRequests } from '../api/user.api';
import NotificationsSkeleton from '../components/skeletons/NotificationsSkeleton';
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from 'lucide-react';
import NoNotificationsFound from '../components/notifications/NoNotificationsFound';

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const {data:friendRequests, isLoading} = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
  });

  const {mutate: acceptFriendRequestMutation, isPending, error} = useMutation({
    mutationFn: (requestId: string) => acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['friendRequests']});
      queryClient.invalidateQueries({queryKey: ['friends']});
    }
  });

  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];

  if(error){
    return <div className='alert alert-error'>{error.message}</div>;
  }
  
  return (
    <div className='p-3 sm:p-5 lg:p-7'>
      <div className='container mx-auto max-w-4xl space-y-6 lg:space-y-8'>
        <h1 className='text-2xl sm:text-3xl font-bold tracking-light mb-5'>Notifications</h1>
        {isLoading ? (
          <NotificationsSkeleton />
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className='space-y-3'>
                  {incomingRequests.map((request) => (
                    <div key={request._id} className='card bg-base-200 hover:shadow-md transition-shadow'>
                      <div className='card-body p-3'>
                        <div className='flex items-center justify-between'>
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 bg-base-300">
                              <img src={request.sender.profilePic} alt={request.sender.fullName} className='rounded-full' />
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className='btn btn-primary btn-sm'
                            onClick={() => acceptFriendRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accepted Reqs Notifications */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div key={notification._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification.sender.profilePic}
                              alt={notification.sender.fullName}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{notification.sender.fullName}</h3>
                            <p className="text-sm my-1">
                              {notification.sender.fullName} accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage