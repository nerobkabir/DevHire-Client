import api from "@/lib/axios";
import type {
  Job,
  ApiResponse,
  PaginatedResponse,
  JobQueryParams,
} from "@/types";

export const jobService = {
  // Get all jobs (public + filters) 
  async getAll(params?: JobQueryParams): Promise<PaginatedResponse<Job>> {
    const { data } = await api.get<PaginatedResponse<Job>>("/jobs", {
      params,
    });
    return data;
  },

  // Get single job
  async getById(id: string): Promise<Job> {
    const { data } = await api.get<ApiResponse<{ job: Job }>>(`/jobs/${id}`);
    return data.data.job;
  },

  // Create job (RECRUITER / ADMIN)
  async create(dto: Partial<Job>): Promise<Job> {
    const { data } = await api.post<ApiResponse<{ job: Job }>>("/jobs", dto);
    return data.data.job;
  },

  // Update job (owner or ADMIN) 
  async update(id: string, dto: Partial<Job>): Promise<Job> {
    const { data } = await api.patch<ApiResponse<{ job: Job }>>(
      `/jobs/${id}`,
      dto
    );
    return data.data.job;
  },

  // Delete job (owner or ADMIN) 
  async delete(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};