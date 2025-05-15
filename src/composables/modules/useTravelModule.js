import { useApiModule } from '../api/useApiModule';

export function useTravelApi () {
  return useApiModule('travels')
}
