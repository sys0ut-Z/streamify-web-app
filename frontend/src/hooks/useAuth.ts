import { checkAuth } from '../api/auth.api';
import { useQuery } from '@tanstack/react-query';

const useAuth = () => {
  const authData = useQuery({
    queryKey: ['authUser'], 
    queryFn: checkAuth,
    retry: false // it will not retry after the request fails
    // it retries 3 times coz server might be down, so it makes the request again
  });

  return {
    user: authData.data,
    isLoading: authData.isLoading
  }
}

export default useAuth