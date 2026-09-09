import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../api/auth.api';

const useLogout = () => {
  const queryClient = useQueryClient();

  const {mutate, isPending, error} = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['authUser']})
  });

  return {
    logoutUser: mutate,
    isPending,
    error
  }
}

export default useLogout