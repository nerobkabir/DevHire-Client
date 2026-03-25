import api from "@/lib/axios";
import type {
  LoginDTO,
  RegisterDTO,
  AuthResponse,
  ApiResponse,
  User,
} from "@/types";

export const authService = {
  //  Register 
  async register(dto: RegisterDTO): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      dto
    );
    return data.data;
  },

  // Login
  async login(dto: LoginDTO): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      dto
    );
    return data.data;
  },

  // Get current user
  async getMe(): Promise<User> {
    const { data } = await api.get<ApiResponse<{ user: User }>>("/auth/me");
    return data.data.user;
  },

  // Change role (admin only)
  async changeRole(userId: string, role: string): Promise<User> {
    const { data } = await api.patch<ApiResponse<{ user: User }>>(
      "/auth/role",
      { userId, role }
    );
    return data.data.user;
  },

  // Save auth data to localStorage
  saveAuth(authData: AuthResponse): void {
    localStorage.setItem("accessToken", authData.accessToken);
    localStorage.setItem("user", JSON.stringify(authData.user));
  },

  // Clear auth data from localStorage
  clearAuth(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  },

  //  Get stored user 
  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  },

  //  Check if logged in 
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("accessToken");
  },
};