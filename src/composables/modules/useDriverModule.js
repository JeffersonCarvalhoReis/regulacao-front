import { useApiModule } from '../api/useApiModule';

export function useDriverApi () {
  return useApiModule('drivers')
}
