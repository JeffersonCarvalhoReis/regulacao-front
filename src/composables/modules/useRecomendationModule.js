import { useApiModule } from '../api/useApiModule';

export function useRecomendationApi () {
  return useApiModule('recomendations')
}
