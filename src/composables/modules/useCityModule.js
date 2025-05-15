import { useApiModule } from '../api/useApiModule';

export function useCityApi () {
  return useApiModule('cities')
}
