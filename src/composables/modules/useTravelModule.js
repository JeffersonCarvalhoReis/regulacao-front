import { useApiModule } from "../api/useApiModule";
import { useDirectApi } from "../api/useDirectApi";

export function useTravelApi() {
  const { get: getTravelsDates } = useDirectApi("travels/dates");
  const travelsModule = useApiModule("travels");

  return {
    ...travelsModule,
    getTravelsDates,
  };
}
