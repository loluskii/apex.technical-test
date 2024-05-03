import './assets/main.css'
import { createPinia } from 'pinia'
import 'vue-toast-notification/dist/theme-bootstrap.css'
import ToastPlugin from 'vue-toast-notification';


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(ToastPlugin, {
  position: 'bottom-right'
});

app.mount('#app')
