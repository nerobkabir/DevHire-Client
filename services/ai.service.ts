import api from "@/lib/axios";
import type { ApiResponse } from "@/types";

export const aiService = {
  // Chatbot
  async chat(dto: {
    message:   string;
    history?:  { role: "user" | "model"; content: string }[];
  }): Promise<{ reply: string }> {
    const { data } = await api.post<ApiResponse<{ reply: string }>>(
      "/ai/chat",
      dto
    );
    return data.data;
  },

  // Search assistant 
  async searchAssistant(query: string): Promise<{
    suggestion: string;
    keywords:   string[];
    categories: string[];
  }> {
    const { data } = await api.post<ApiResponse<{
      suggestion: string;
      keywords:   string[];
      categories: string[];
    }>>("/ai/search-assistant", { query });
    return data.data;
  },

  // Generate job description 
  async generateDescription(dto: {
    title:     string;
    company:   string;
    skills?:   string[];
    location?: string;
  }): Promise<{ description: string }> {
    const { data } = await api.post<ApiResponse<{ description: string }>>(
      "/ai/generate-description",
      dto
    );
    return data.data;
  },

  //  Summarize reviews
  async summarizeReviews(jobId: string): Promise<{
    summary:    string;
    sentiment:  "positive" | "neutral" | "negative";
    avgRating:  number;
    highlights: string[];
  }> {
    const { data } = await api.post<ApiResponse<{
      summary:    string;
      sentiment:  "positive" | "neutral" | "negative";
      avgRating:  number;
      highlights: string[];
    }>>("/ai/review-summary", { jobId });
    return data.data;
  },

  // Analyze resume 
  async analyzeResume(dto: {
    resumeText: string;
    jobTitle?:  string;
  }): Promise<{
    skills:         string[];
    experience:     string;
    strengths:      string[];
    improvements:   string[];
    jobSuggestions: string[];
    overallScore:   number;
  }> {
    const { data } = await api.post<ApiResponse<{
      skills:         string[];
      experience:     string;
      strengths:      string[];
      improvements:   string[];
      jobSuggestions: string[];
      overallScore:   number;
    }>>("/ai/analyze-resume", dto);
    return data.data;
  },
};