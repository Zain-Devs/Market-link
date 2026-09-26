import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { User, UserRole } from '../types';
import { api } from '../api/client';
import { INITIAL_USERS } from '../api/mockData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | 'guest';
  isLoading: boolean;

  login: (
    email: string,
    pass: string
  ) => Promise<void>;

  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'farmer';
    phone: string;
    address: string;
    stall_name?: string;
  }) => Promise<void>;

  logout: () => Promise<void>;

  switchDemoRole: (
    role: UserRole
  ) => Promise<void>;

  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    api.getToken()
  );

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const profile = await api.getProfile();

      setUser(profile);
      setToken(api.getToken());
    } catch (e) {
      console.warn(
        'Failed to load profile:',
        e
      );

      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (
    email: string,
    pass: string
  ) => {
    setIsLoading(true);

    try {
      const res = await api.login(
        email,
        pass
      );

      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'farmer';
    phone: string;
    address: string;
    stall_name?: string;
  }) => {
    setIsLoading(true);

    try {
      const res = await api.register(
        payload
      );

      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await api.logout();

      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchDemoRole = async (
    targetRole: UserRole
  ) => {
    setIsLoading(true);

    try {
      const demoUser =
        INITIAL_USERS.find(
          (u) => u.role === targetRole
        ) || INITIAL_USERS[3];

      await api.login(
        demoUser.email,
        'password123'
      );

      await refreshProfile();
    } catch (e) {
      console.error(
        'Demo switch error:',
        e
      );
    } finally {
      setIsLoading(false);
    }
  };

  const role: UserRole | 'guest' = user
    ? user.role
    : 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};