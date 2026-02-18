import { useApiModule } from "../api/useApiModule";

export function useBpaApi() {
  return useApiModule("bpas");
}
