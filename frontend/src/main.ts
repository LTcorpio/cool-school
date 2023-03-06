import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import './assets/css/global.less'
import './assets/css/_themes.css'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

import SocketService from '@/utils/socket_service'
SocketService.Instance.connect()

const app = createApp(App)
app.config.globalProperties.$socket = SocketService.Instance
app.config.globalProperties.$http = axios
app.use(store).use(router).mount('#app')
