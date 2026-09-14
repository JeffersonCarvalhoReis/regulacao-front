import { useApiModule } from '../api/useApiModule';

export function useScheduleApi () {
  return useApiModule('schedules')
}
