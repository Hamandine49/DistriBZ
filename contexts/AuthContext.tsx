import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextProps {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  signInWithGoogle: async () => {},
  loading: false,
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from AsyncStorage)
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // In a real implementation, this would connect to Supabase Auth
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock successful login
      // In reality, this would authenticate via Supabase
      const user = {
        id: 'user-123',
        email,
      };
      
      setUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Mock successful registration
      // In reality, this would register via Supabase
      const user = {
        id: 'user-' + Date.now(),
        email,
        name,
      };
      
      setUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Clear user from state and storage
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // Mock successful Google login
      // In reality, this would authenticate via Supabase with Google provider
      const user = {
        id: 'google-user-123',
        email: 'user@gmail.com',
        name: 'Google User',
      };
      
      setUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error with Google sign in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        signIn, 
        signUp, 
        signOut, 
        signInWithGoogle,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);