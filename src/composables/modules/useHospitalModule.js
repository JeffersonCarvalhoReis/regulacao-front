import { useApiModule } from '../api/useApiModule';

export function useHospitalApi () {
  return useApiModule('hospitals')
}
