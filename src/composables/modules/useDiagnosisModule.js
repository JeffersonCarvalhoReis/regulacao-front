import { useApiModule } from '../api/useApiModule';

export function useDiagnosisApi () {
  return useApiModule('diagnoses')
}
