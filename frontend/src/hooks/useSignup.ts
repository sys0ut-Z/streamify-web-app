import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../api/auth.api';

const useSignup = () => {
  const queryClient = useQueryClient();

  const {mutate, isPending, error} = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['authUser']}),
    /* 
      - You perform signup/login, and the server-side auth state changes
      - But TanStack Query doesn't automatically know that ["authUser"] is now potentially stale
      - If that query is currently being used by a component, TanStack Query will generally REFETCH it in the background
    */
  });

  return {
    signupUser: mutate,
    isPending,
    error
  }
}

export default useSignup