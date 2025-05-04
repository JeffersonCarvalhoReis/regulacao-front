import { useApiModule } from '../api/useApiModule';

export function useHealthUnitApi () {
  return useApiModule('health-units')
}
