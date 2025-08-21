import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Configuração do Echo
window.Pusher = Pusher

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  withCredentials: false,
  cluster: 'mt1',
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
})
