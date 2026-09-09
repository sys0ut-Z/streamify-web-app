import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../api/auth.api';

const useLogin = () => {
  const queryClient = useQueryClient();

  const {mutate, isPending, error} = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['authUser']}),
    /* 
      - You perform signup/login, and the server-side auth state changes
      - But TanStack Query doesn't automatically know that ["authUser"] is now potentially stale
      - If that query is currently being used by a component, TanStack Query will generally REFETCH it in the background
    */
  });

  return {
    loginUser: mutate,
    isPending,
    error
  }
}

export default useLogin