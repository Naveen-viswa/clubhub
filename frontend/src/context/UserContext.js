import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth';
import { authAPI } from '../services/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const cognitoUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const groups = session.tokens?.accessToken?.payload['cognito:groups'] || [];
      
      console.log('=== UserContext Debug ===');
      console.log('Cognito User:', cognitoUser);
      console.log('Session:', session);
      console.log('Groups from token:', groups);
      
      const userData = {
        userId: cognitoUser.userId,
        email: cognitoUser.signInDetails?.loginId || 'user@example.com',
        username: cognitoUser.username,
        groups: groups
      };
      
      console.log('Final userData:', userData);
      console.log('=======================');
      
      setUser(userData);
  
      
      // Try to fetch user profile from backend
      try {
        const response = await authAPI.getProfile();
        setProfile(response.data.data);
      } catch (error) {
        // Profile doesn't exist yet, that's okay
        console.log('No profile found yet');
      }
      
    } catch (error) {
      console.log('User not logged in');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };
  

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  

  const isAdmin = () => user?.groups?.includes('Admin');
  const isEventCoordinator = () => user?.groups?.includes('Coordinator');
  const isMember = () => user?.groups?.includes('Member');

  const value = {
    user,
    profile,
    loading,
    setProfile,
    checkUser,
    logout,
    isAdmin,
    isEventCoordinator,
    isMember
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
