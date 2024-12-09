"use client"
import React, { ReactNode, useEffect } from 'react';
import { selectIsLoggedIn } from '@/Redux/LoginSlice';
import { useSelector } from 'react-redux';
import NotAuthenticated from './NotAuthenticated';

interface LayoutProps {
  children: ReactNode;
}

const NoAuthDisplay: React.FC<LayoutProps> = ({ children }) => {
  const isAuthenticated = useSelector(selectIsLoggedIn);
  useEffect(() => {
      }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <NotAuthenticated />
  }

  return <div>{children}</div>;
};

export default NoAuthDisplay;