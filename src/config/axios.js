import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import router from "@/router";
import { useAuthStore } from "@/stores/authStore";
import { useMeStore } from "@/stores/me";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: backendURL + "/api",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  withXSRFToken: true,
});

export const getCSRFToken = () => {
  return axios.get(`${backendURL}/sanctum/csrf-cookie`, {
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
    withXSRFToken: true,
  });
};

// Tempo de inatividade permitido
const inactivityDelay = 2 * 60 * 60 * 1000;

// const inactivityDelay = 2 * 1000;

const { showInactivityAlert } = useSweetAlertFeedback();

function desconectUser() {
  const mestore = useMeStore();
  const authStore = useAuthStore();
  authStore.logout();
  mestore.reset();
  router.push({ name: "login" });
}

// Variável para armazenar o timeout
let logoutTimeout = null;
// Função para reiniciar o timeout
function resetLogoutTimeout() {
  if (logoutTimeout) clearTimeout(logoutTimeout);
  const routeName = router.currentRoute.value.name;
  if (routeName && routeName !== "login") {
    logoutTimeout = setTimeout(() => {
      showInactivityAlert();
      desconectUser();
    }, inactivityDelay);
  }
}

// Interceptor para requisições: reinicia o timeout antes de cada requisição
api.interceptors.request.use((config) => {
  resetLogoutTimeout();
  return config;
});

let appInitialized = false;

function initializeApp() {
  setTimeout(() => {
    appInitialized = true;
  }, 500);
}

// Interceptor para respostas: reinicia o timeout a cada resposta recebida
api.interceptors.response.use(
  (response) => {
    resetLogoutTimeout();
    initializeApp();
    return response;
  },
  (error) => {
    resetLogoutTimeout();
    if (error.response && error.response.status === 401) {
      // Verifica se a rota atual não é 'login'
      const routeName = router.currentRoute.value.name;
      if (routeName && routeName !== "login") {
        desconectUser();
        if (appInitialized) {
          showInactivityAlert();
        }
      }
    }
    return Promise.reject(error);
  },
);
