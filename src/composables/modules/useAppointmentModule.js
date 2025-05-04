import { useApiModule } from '../api/useApiModule';

export function useAppointmentApi () {
  return useApiModule('appointments')
}
