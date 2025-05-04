import { useApiModule } from '../api/useApiModule';

export function useHealthAgentApi () {
  return useApiModule('health-agents')
}
