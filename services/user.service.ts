import api from "@/lib/axios";
import type {
  User,
  ApiResponse,
  PaginatedResponse,
  UserQueryParams,
} from "@/types";

export const userService = {
  //  Get all users (ADMIN only)
  async getAll(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
    const { data } = await api.get<PaginatedResponse<User>>("/users", {
      params,
    });
    return data;
  },

  // Get single user 
  async getById(id: string): Promise<User> {
    const { data } = await api.get<ApiResponse<{ user: User }>>(
      `/users/${id}`
    );
    return data.data.user;
  },

  // Update profile
  async update(
    id: string,
    dto: Partial<Pick<User, "name" | "email" | "bio" | "skills" | "github" | "avatar">>
  ): Promise<User> {
    const { data } = await api.patch<ApiResponse<{ user: User }>>(
      `/users/${id}`,
      dto
    );
    return data.data.user;
  },

  // Delete user (ADMIN only)
  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  // Change role (ADMIN only) 
  async changeRole(id: string, role: string): Promise<User> {
    const { data } = await api.patch<ApiResponse<{ user: User }>>(
      `/users/${id}/role`,
      { role }
    );
    return data.data.user;
  },
};