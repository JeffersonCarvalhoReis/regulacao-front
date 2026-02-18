import { useApiModule } from "../api/useApiModule";

export function useBpaSettingApi() {
  return useApiModule("bpa-settings");
}
