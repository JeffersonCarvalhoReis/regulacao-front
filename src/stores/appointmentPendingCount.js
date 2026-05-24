import { api } from "@/config/axios";
import { defineStore } from "pinia";

export const useAppointmentPendingStore = defineStore("appointmentPending", {
  state: () => ({
    pending: 0,
  }),

  actions: {
    async appointmentPendingCount() {
      const response = await api.get("/appointments-count");

      this.pending = response.data.appointments_pending;
    },
  },
});
