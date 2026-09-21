import { api } from "@/config/axios";

export function useDashboardApi() {
  const getSummary = async () => {
    const response = await api.get("/dashboard");
    return response.data.data;
  };

  return { getSummary };
}
