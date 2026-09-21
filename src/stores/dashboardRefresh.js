import { defineStore } from "pinia";

export const useDashboardRefreshStore = defineStore("dashboardRefresh", {
  state: () => ({
    signal: 0,
  }),
  actions: {
    bump() {
      this.signal++;
    },
  },
});
