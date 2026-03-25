// Enums 
export type Role        = "USER" | "RECRUITER" | "ADMIN";
export type JobCategory = "Frontend" | "Backend" | "Fullstack" | "DevOps" | "Mobile" | "Data" | "AI/ML" | "QA" | "Design" | "Other";
export type JobType     = "Full-time" | "Part-time" | "Contract" | "Remote" | "Internship";
export type JobStatus   = "OPEN" | "CLOSED";
export type AppStatus   = "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";

// User
export interface User {
  id:        string;
  name:      string;
  email:     string;
  role:      Role;
  bio?:      string;
  skills?:   string[];
  github?:   string;
  avatar?:   string;
  isActive:  boolean;
  createdAt: string;
  updatedAt: string;
}

// Job
export interface Job {
  id:             string;
  title:          string;
  description:    string;
  company:        string;
  salary:         number;
  location:       string;
  category:       JobCategory;
  jobType:        JobType;
  requiredSkills: string[];
  status:         JobStatus;
  createdBy:      User | string;
  createdAt:      string;
  updatedAt:      string;
}

//  Application 
export interface Application {
  id:           string;
  jobId:        Job | string;
  applicantId:  User | string;
  coverLetter?: string;
  status:       AppStatus;
  createdAt:    string;
  updatedAt:    string;
}

// Review
export interface Review {
  id:        string;
  jobId:     Job | string;
  userId:    User | string;
  rating:    number;
  comment:   string;
  createdAt: string;
  updatedAt: string;
}

// Auth DTOs
export interface LoginDTO {
  email:    string;
  password: string;
}

export interface RegisterDTO {
  name:     string;
  email:    string;
  password: string;
  role?:    "USER" | "RECRUITER";
}

export interface AuthResponse {
  user:        User;
  accessToken: string;
}

// API wrappers 
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data:    T[];
  meta: {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
  };
}

// Query params 
export interface JobQueryParams {
  search?:    string;
  category?:  string;
  location?:  string;
  jobType?:   string;
  salaryMin?: number;
  salaryMax?: number;
  sort?:      string;
  page?:      number;
  limit?:     number;
}

export interface UserQueryParams {
  search?: string;
  role?:   Role;
  page?:   number;
  limit?:  number;
}

export interface ApplicationQueryParams {
  status?: AppStatus;
  page?:   number;
  limit?:  number;
}

// Dashboard 
export interface DashboardStats {
  totals: {
    users:        number;
    jobs:         number;
    applications: number;
    reviews:      number;
  };
  usersByRole:          Record<string, number>;
  jobsByStatus:         Record<string, number>;
  applicationsByStatus: Record<string, number>;
}

export interface ChartData {
  labels:   string[];
  datasets: Record<string, number[]>;
}

export interface PieChartData {
  jobsByCategory:       { label: string; value: number }[];
  applicationsByStatus: { label: string; value: number }[];
  usersByRole:          { label: string; value: number }[];
}