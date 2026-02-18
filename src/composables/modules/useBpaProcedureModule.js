import { useApiModule } from "../api/useApiModule";

export function useBpaProcedureApi() {
  return useApiModule("bpa-procedures");
}
