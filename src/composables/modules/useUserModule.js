import { useApiModule } from '../api/useApiModule';
import { useDirectApi } from '../api/useDirectApi';

export function useUserApi () {
  const {
    update: updateUser,
    destroy: destroyUser,
    get: getUser,
    loading: loadingUser,
    error: errorUser,
  } = useDirectApi('users/me');

  const userApiModule = useApiModule('users');

  return {
    ...userApiModule,
    updateUser,
    destroyUser,
    getUser,
    loadingUser,
    errorUser,
  }
}
