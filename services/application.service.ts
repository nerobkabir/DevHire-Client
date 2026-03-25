import api from "@/lib/axios";
import type {
  Application,
  ApiResponse,
  PaginatedResponse,
  ApplicationQueryParams,
} from "@/types";

export const applicationService = {
  // Apply for a job (USER)
  async apply(dto: {
    jobId:        string;
    coverLetter?: string;
  }): Promise<Application> {
    const { data } = await api.post<ApiResponse<{ application: Application }>>(
      "/applications",
      dto
    );
    return data.data.application;
  },

  // Get my applications (USER) 
  async getMine(
    params?: ApplicationQueryParams
  ): Promise<PaginatedResponse<Application>> {
    const { data } = await api.get<PaginatedResponse<Application>>(
      "/applications/my",
      { params }
    );
    return data;
  },

  //  Get applicants for a job (RECRUITER / ADMIN) 
  async getByJob(
    jobId:   string,
    params?: ApplicationQueryParams
  ): Promise<PaginatedResponse<Application>> {
    const { data } = await api.get<PaginatedResponse<Application>>(
      `/applications/job/${jobId}`,
      { params }
    );
    return data;
  },

  // Get all applications (ADMIN) 
  async getAll(
    params?: ApplicationQueryParams
  ): Promise<PaginatedResponse<Application>> {
    const { data } = await api.get<PaginatedResponse<Application>>(
      "/applications",
      { params }
    );
    return data;
  },

  //  Update status (RECRUITER / ADMIN)
  async updateStatus(
    id:     string,
    status: string
  ): Promise<Application> {
    const { data } = await api.patch<ApiResponse<{ application: Application }>>(
      `/applications/${id}/status`,
      { status }
    );
    return data.data.application;
  },

  //  Withdraw / delete (USER own or ADMIN) 
  async delete(id: string): Promise<void> {
    await api.delete(`/applications/${id}`);
  },
};