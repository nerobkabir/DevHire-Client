"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import type { User, LoginDTO, RegisterDTO } from "@/types";

// Types
interface AuthContextValue {
  user:         User | null;
  isLoading:    boolean;
  isAuthenticated: boolean;
  login:        (dto: LoginDTO)    => Promise<void>;
  register:     (dto: RegisterDTO) => Promise<void>;
  logout:       ()                 => void;
  refreshUser:  ()                 => Promise<void>;
}

// Context
const AuthContext = createContext<AuthContextValue | null>(null);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const router  = useRouter();
  const [user, setUser]         = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  // Rehydrate user from localStorage on mount
  useEffect(() => {
    const stored = authService.getStoredUser();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback(async (dto: LoginDTO) => {
    const result = await authService.login(dto);
    authService.saveAuth(result);
    setUser(result.user);
  }, []);

  const register = useCallback(async (dto: RegisterDTO) => {
    const result = await authService.register(dto);
    authService.saveAuth(result);
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    authService.clearAuth();
    setUser(null);
    router.push("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const fresh = await authService.getMe();
      setUser(fresh);
      localStorage.setItem("user", JSON.stringify(fresh));
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}