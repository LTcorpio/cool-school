/**
 * 定义基于pinia的store存储
 * 设置相关的store数据
 */
import { defineStore } from 'pinia'

// 创建store，defineStore调用后返回函数，调用该函数获得Store实体
const useThemeStore = defineStore({
    // 必传的参数，id值，在store中唯一
    id: 'settingStore',
    // 定义数据，返回对象和属性
    state: () => ({
        globalTheme: '',
        chartTheme: ''
    }),
    // 获取store模块的属性
    getters: {
        getGlobalTheme: (state) => state.globalTheme,
        getChartTheme: (state) => state.chartTheme
    },
    // 设置store模块的属性
    actions: {
        setGlobalTheme(theme: string) { this.globalTheme = theme },
        setChartTheme(theme: string) { this.chartTheme = theme }
    },
    // 开启数据缓存(pinia-plugin-persist)
    persist: {
        // 开启持久化
        enabled: true,
        strategies: [
            {
                // storage  存储策略可指定为localStorage或sessionStorage
                storage: localStorage,
                // 可以通过paths指定需要持久化的值(state)，其他没有指定的则不会持久化
                paths: [ 'globalTheme', 'chartTheme' ]
            }
        ]
    }
})

export default useThemeStore
