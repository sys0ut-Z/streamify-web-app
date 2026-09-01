import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { checkAuth } from '../../api/auth.service';
import { Navigate } from 'react-router';

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const {data:user, isLoading, error} = useQuery({
    queryKey: ['auth'], 
    queryFn: checkAuth,
    retry: false // it will not retry after the request fails
    // it retries 3 times coz server might be down, so it makes the request again
  });

  if(isLoading){
    return (
      <div>
        Authenticating...
      </div>
    )
  }

  if(error){
    return (
      <div>
        Error checking auth : {error.message}
      </div>
    )
  }

  if(user){
    return <Navigate to="/" />
  }

  return children;
}

export default ProtectedRoute