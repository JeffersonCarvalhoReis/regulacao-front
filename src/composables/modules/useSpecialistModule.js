import { useApiModule } from '../api/useApiModule';

export function useSpecialistApi () {
  return useApiModule('specialists')
}
