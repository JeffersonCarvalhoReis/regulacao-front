import { useApiModule } from '../api/useApiModule';

export function useVehicleApi () {
  return useApiModule('vehicles')
}
