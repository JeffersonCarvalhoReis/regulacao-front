import { useApiModule } from "../api/useApiModule";

export function useMonitoringReportApi() {
  return useApiModule("monitoring-reports");
}
