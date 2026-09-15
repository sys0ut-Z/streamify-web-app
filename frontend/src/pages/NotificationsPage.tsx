import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { acceptFriendRequest, getFriendRequests } from '../api/user.api';
import NotificationsSkeleton from '../components/skeletons/NotificationsSkeleton';

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const {data:friendRequests, isLoading} = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
  });

  const {mutate: acceptFriendRequestMutation, isPending, error} = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['friendRequests']});
      queryClient.invalidateQueries({queryKey: ['friends']});
    }
  });

  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];

  return (
    <div className='p-3 sm:p-5 lg:p-7'>
      <div className='container mx-auto max-w-4xl space-y-6 lg:space-y-8'>
        <h1 className='text-2xl sm:text-3xl font-bold tracking-light mb-5'>Notifications</h1>
        {isLoading ? (
          <NotificationsSkeleton />
        ) : (
          <>
            
          </>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage