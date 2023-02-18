import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import axios from 'axios'

import '@iconfu/svg-inject'
import './assets/css/global.less'
import './assets/css/_themes.css'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

const app = createApp(App)

import SocketService from '@/utils/socket_service'
SocketService.Instance.connect()
app.config.globalProperties.$socket = SocketService.Instance
// app.config.globalProperties.$http = axios

app.use(store).use(router).mount('#app')
