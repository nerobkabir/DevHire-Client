import api from "@/lib/axios";
import type {
  ApiResponse,
  DashboardStats,
  ChartData,
  PieChartData,
} from "@/types";

export const dashboardService = {
  // Overview stats 
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get<ApiResponse<DashboardStats>>(
      "/dashboard/stats"
    );
    return data.data;
  },

  //Bar chart data (last 6 months) 
  async getBarChart(): Promise<ChartData> {
    const { data } = await api.get<ApiResponse<ChartData>>(
      "/dashboard/chart-data/bar"
    );
    return data.data;
  },

  //Line chart data (last 30 days) 
  async getLineChart(): Promise<ChartData> {
    const { data } = await api.get<ApiResponse<ChartData>>(
      "/dashboard/chart-data/line"
    );
    return data.data;
  },

  // Pie chart data
  async getPieChart(): Promise<PieChartData> {
    const { data } = await api.get<ApiResponse<PieChartData>>(
      "/dashboard/chart-data/pie"
    );
    return data.data;
  },

  // Recent activity
  async getRecentActivity() {
    const { data } = await api.get("/dashboard/recent-activity");
    return data.data;
  },
};