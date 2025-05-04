import { useApiModule } from '../api/useApiModule';

export function useRequestingUnitApi () {
  return useApiModule('requesting-units')
}
