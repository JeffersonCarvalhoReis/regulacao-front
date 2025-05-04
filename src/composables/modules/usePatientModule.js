import { useApiModule } from '../api/useApiModule';

export function usePatientApi () {
  return useApiModule('patients')
}
