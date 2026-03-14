"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { me } from "@/lib/api/adminAuthApi";

interface User {
  username: string | null;
  role: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserInfo = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await me(); // { username, role }

      if (data?.username) {
        setUser({
          username: data.username,
          role: data.role ?? null,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch admin info:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();

    const onAuthChanged = () => fetchUserInfo();

    window.addEventListener("auth-changed", onAuthChanged);

    return () => {
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, [fetchUserInfo]);

  const isLoggedIn = Boolean(user?.username);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        refreshUser: fetchUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}