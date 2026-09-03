import React from 'react'
import { Navigate, Outlet } from 'react-router';
import PageLoader from '../loaders/PageLoader';
import useAuth from '../../hooks/useAuth';

const GuestRoute = () => {
  const {user, isLoading} = useAuth();

  console.log(user);
  
  if(isLoading) return <PageLoader />

  if(user) return <Navigate to="/" />

  return <Outlet />;
}

export default GuestRoute