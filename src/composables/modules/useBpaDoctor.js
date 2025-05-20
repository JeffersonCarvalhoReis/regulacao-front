import { useApiModule } from '../api/useApiModule';

export function useBpaDoctorApi () {
  return useApiModule('bpa-doctors')
}
