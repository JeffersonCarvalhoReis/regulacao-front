import { useApiModule } from '../api/useApiModule';

export function useProcedureApi () {
  return useApiModule('procedures')
}
