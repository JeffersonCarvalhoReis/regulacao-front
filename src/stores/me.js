import { defineStore } from 'pinia';
import { api } from '@/config/axios';

export const useMeStore = defineStore('me', () => {
  const user = ref(null);
  const role = ref(null);
  const health_unit = ref(null);
  const health_unit_cnes = ref(null);
  const isLoggedIn = computed(() => !!user.value)

  const getMe = async () => {
    try {
      const response = await api.get('/me');
      user.value = response.data.user;
      role.value = response.data.role;
      health_unit.value = response.data.health_unit;
      health_unit_cnes.value = response.data.health_unit_cnes;

    } catch (err) {
      if (err.response?.status === 401) {
        reset();
      }
    }
  }
  const reset = () => {
    user.value = null;
    role.value = null;
  };

  return { isLoggedIn, role, user, health_unit, health_unit_cnes, getMe, reset }
},{
  persist: {
    storage: localStorage,
    pick: ['user', 'role'],
  },
})
