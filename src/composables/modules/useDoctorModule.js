import { useApiModule } from '../api/useApiModule';

export function useDoctorApi () {
  return useApiModule('doctors')
}
