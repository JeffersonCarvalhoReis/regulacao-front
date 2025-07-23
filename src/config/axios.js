import axios from 'axios';
import router from '@/router';
import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
import { useAuthStore } from '@/stores/authStore';
import { useMeStore } from '@/stores/me'

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: backendURL + '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
});

export const getCSRFToken = () => {
  return axios.get(`${backendURL}/sanctum/csrf-cookie`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    withXSRFToken: true,
  })
};

// Tempo de inatividade permitido
const inactivityDelay = 2 * 60 * 60 * 1000;
// const inactivityDelay = 4 * 1000;
const { showInactivityAlert } = useSweetAlertFeedback();

function desconectUser () {
  const mestore = useMeStore();
  const authStore = useAuthStore();
  authStore.hasSession = false;
  mestore.reset();
  router.push({ name: 'login' });
}

// Variável para armazenar o timeout
let logoutTimeout = null;

// Função para reiniciar o timeout
function resetLogoutTimeout () {
  if (logoutTimeout) clearTimeout(logoutTimeout);
  if (router.currentRoute.value.name !== 'login'){
    logoutTimeout = setTimeout(() => {
      showInactivityAlert();
      desconectUser();
    }, inactivityDelay);
  }
}

// Interceptor para requisições: reinicia o timeout antes de cada requisição
api.interceptors.request.use(config => {
  resetLogoutTimeout();
  return config;
});

// Interceptor para respostas: reinicia o timeout a cada resposta recebida
api.interceptors.response.use(
  response => {
    resetLogoutTimeout();
    return response;
  },
  error => {
    resetLogoutTimeout();
    if (error.response && error.response.status === 401) {

      // Verifica se a rota atual não é 'login'
      if (router.currentRoute.value.name !== 'login') {
        showInactivityAlert();
        desconectUser();
      }
    }
    return Promise.reject(error);
  }
);
