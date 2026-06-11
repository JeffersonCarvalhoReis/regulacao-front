import { api, getCSRFToken } from "@/config/axios.js";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useMeStore } from "./me";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const router = useRouter();
    const error = ref("");
    const meStore = useMeStore();
    const hasSession = ref(false);

    const login = async (user, password) => {
      await getCSRFToken();
      const response = await api.post("/login", {
        user,
        password,
      });
      meStore.user = response.data.user;
      meStore.role = response.data.role;
      hasSession.value = true;
      localStorage.setItem("hasSession", "true");
      window.Echo.connect();
      router.push({ name: "home" });
    };

    const logout = async (redirect = true) => {
      try {
        window.teardownEchoChannels?.();
        window.Echo?.disconnect();

        hasSession.value = false;
        localStorage.setItem("hasSession", "false");

        meStore.reset();

        await api.post("/logout");
        if (redirect) {
          router.push({ name: "login" });
        }
      } catch (error) {
        console.log(error);
      }
    };

    return { login, logout, error, hasSession };
  },
  {
    persist: {
      storage: localStorage,
      pick: ["hasSession"],
    },
  },
);
