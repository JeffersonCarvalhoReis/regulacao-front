import { useAuthStore } from "@/stores/authStore";
import { useMeStore } from "@/stores/me";
import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router/auto";
import MainRoutes from "./MainRoutes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(MainRoutes),
});

// Controla se a sessão já foi validada com o backend neste carregamento
// da página. É uma variável de módulo (não persistida), então ela volta
// a "false" sempre que a página é recarregada de verdade (F5, nova aba),
// mas não a cada navegação interna do SPA.
let sessionVerified = false;

// Estado exibido pelo App.vue enquanto a sessão está sendo validada.
// Começa "true" somente quando existe uma sessão salva para checar (lido
// direto do localStorage, antes até da store ser hidratada), assim quem
// nunca logou vai direto para o login sem passar pelo loading.
export const authChecking = ref(localStorage.getItem("hasSession") === "true");

router.beforeEach(async (to, from, next) => {
  const meStore = useMeStore();
  const auth = useAuthStore();

  await nextTick();

  // Sempre que a página é aberta/recarregada com "hasSession" ativo,
  // valida com o backend antes de decidir qualquer coisa. Isso é
  // necessário mesmo que meStore.isLoggedIn já esteja "true", pois esse
  // valor pode vir apenas do localStorage (dados de uma sessão antiga),
  // sem garantir que o cookie de sessão ainda é válido no servidor.
  if (auth.hasSession && !sessionVerified) {
    sessionVerified = true;
    await meStore.getMe();
  }
  setTimeout(() => {
    authChecking.value = false;
  }, 500);

  // Se depois da validação a sessão continua marcada como ativa mas o
  // backend não retornou usuário (401), trata como sessão expirada.
  if (auth.hasSession && !meStore.isLoggedIn) {
    auth.hasSession = false;
    meStore.reset();

    await auth.logout(false);

    return next({ name: "login" });
  }

  if (to.meta.requiresAuth && !meStore.isLoggedIn) {
    return next({ name: "login" });
  }

  if (to.meta.login && meStore.isLoggedIn) {
    if (meStore.role == "admin") return next({ name: "users" });
    if (meStore.role == "reception") return next({ name: "patients" });
    if (meStore.role == "regulation_doctor") return next({ name: "patients" });
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
    if (meStore.role == "regulation_doctor") return next({ name: "patients" });
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
