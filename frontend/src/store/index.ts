import { createPinia } from 'pinia'
// store存储持久化
import piniaPersist from 'pinia-plugin-persist'

// 创建pinia的store实例
const store = createPinia()
store.use(piniaPersist)

export default store
