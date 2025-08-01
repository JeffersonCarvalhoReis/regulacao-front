// Utilities
import { defineStore } from 'pinia';
import { api } from '@/config/axios';

export const useAppointmentPendingStore = defineStore('appointmentPending', {

  state: () => ({
    pending: '',
  }),

  actions: {
    async appointmentPendingCount () {
      const response = await api.get('/appointments-count');

      this.pending = response.data.appointments_pending;

    },
  },

})
