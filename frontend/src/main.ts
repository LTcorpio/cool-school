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
// WebSocket服务器地址，根据实际进行修改。如果是本地运行则将IP替换为localhost或127.0.0.1
SocketService.Instance.connect('ws://8.130.76.29:3090')

const app = createApp(App)
app.config.globalProperties.$socket = SocketService.Instance
app.config.globalProperties.$http = axios
app.use(store).use(router).mount('#app')
