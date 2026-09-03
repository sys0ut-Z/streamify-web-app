import useAuth from '../../hooks/useAuth';
import PageLoader from '../loaders/PageLoader';
import { Navigate, Outlet } from 'react-router';

const OnboardProtectedRoute = () => {
  const {user, isLoading} = useAuth();

  const isAuthenticated = Boolean(user); // '{}' will always be true if user is present
  const isOnboarded = user?.isOnboarded;

  if(isLoading) return <PageLoader />

  if(!isAuthenticated) return <Navigate to={"/auth/login"} />

  if(isOnboarded) return <Navigate to={"/"} />
  
  return <Outlet />
}

export default OnboardProtectedRoute