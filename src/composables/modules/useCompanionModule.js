import { useApiModule } from '../api/useApiModule';

export function useCompanionApi () {
  return useApiModule('companions')
}
