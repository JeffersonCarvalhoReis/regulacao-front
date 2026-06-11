import { useAuthStore } from "@/stores/authStore";
import { useMeStore } from "@/stores/me";
import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router/auto";
import MainRoutes from "./MainRoutes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(MainRoutes),
});

router.beforeEach(async (to, from, next) => {
  const meStore = useMeStore();
  const auth = useAuthStore();

  await nextTick();

  if (auth.hasSession && !meStore.isLoggedIn) {
    try {
      await meStore.getMe();
    } catch {
      auth.hasSession = false;
      meStore.reset();

      await auth.logout(false);

      return next({ name: "login" });
    }
  }

  if (to.meta.requiresAuth && !meStore.isLoggedIn) {
    return next({ name: "login" });
  }

  if (to.meta.login && meStore.isLoggedIn) {
    if (meStore.role == "admin") return next({ name: "users" });
    if (meStore.role == "reception") return next({ name: "patients" });
    if (meStore.role == "provider_unit_manager")
      return next({ name: "appointments-management" });
    if (meStore.role == "tfd") return next({ name: "patients" });
    if (meStore.role == "caps") return next({ name: "patients" });
    if (meStore.role == "regulation_officer") return next({ name: "home" });
    router.back();
  }

  if (to.meta.roles && !to.meta.roles.includes(meStore.role)) {
    if (meStore.role == "admin") return next({ name: "users" });
    if (meStore.role == "reception") return next({ name: "patients" });
    if (meStore.role == "provider_unit_manager")
      return next({ name: "appointments-management" });
    if (meStore.role == "tfd") return next({ name: "patients" });
    if (meStore.role == "caps") return next({ name: "patients" });
    if (meStore.role == "regulation_officer") return next({ name: "home" });
    router.back();
  }

  next();
});
// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
