<template>
  <!-- 主题切换单选 -->
  <div class="btn-group" role="group">
        <input id="dark_mode" :checked="themeStore.globalTheme === 'dark'" autocomplete="off" class="btn-check"
               name="btn-radio"
               type="radio" @change="changeTheme('dark')">
        <label class="btn btn-outline-secondary" for="dark_mode"><i class="bi bi-moon"></i></label>
        <input id="light_mode" :checked="themeStore.globalTheme === 'light'" autocomplete="off" class="btn-check"
               name="btn-radio"
               type="radio" @change="changeTheme('light')">
        <label class="btn btn-outline-secondary" for="light_mode"><i class="bi bi-sun"></i></label>
      </div>
</template>

<script setup>
import { getCurrentInstance, onBeforeMount, onBeforeUnmount } from 'vue'

import useThemeStore from '@/store/modules/theme'
const themeStore = useThemeStore()

const { proxy } = getCurrentInstance();

// 更换主题功能实现
// changeTheme: 同步主题至客户端，不会修改主题
// applyChangeTheme: 根据 store 值设置主题，不会同步至客户端
let changeTheme = (themeName) => {
  proxy.$socket.send({
    action: 'themeChange',
    // globalTheme: dark/light，于 @src/assets/css/_themes.css 中控制
    globalTheme: themeName,
    // chartTheme: dark/walden，此为 ECharts 的主题名称，可以使用官网提供的内置主题也可以自定义主题
    // 自定义主题存放位置：@src/utils/EChartsThemes
    chartTheme: themeName === 'dark' ? 'dark' : 'walden',
    socketType: 'themeChange'
  })
}, applyChangeTheme = (resp) => {
  // Bootstrap 5.3版本中增加了“data-bs-theme”，可对组件的明/暗样式进行控制
  document.documentElement.setAttribute('data-bs-theme', resp.globalTheme)
  // 修改 data-bs-theme 的值只会对 Bootstrap 相关的组件生效，图表的主题需要另行更改
  themeStore.setGlobalTheme(resp.globalTheme)
  themeStore.setChartTheme(resp.chartTheme)
}

onBeforeMount(() => {
  proxy.$socket.registerCallBack('themeChange', applyChangeTheme)

  // 默认主题为黑色，如果主题在store中已存在则直接使用，可实现多个客户端同步到同一主题
  // store中没有主题，设置默认主题为黑色
  if (themeStore.globalTheme === '') {
    applyChangeTheme({ globalTheme: 'dark', chartTheme: 'dark' })
    // 20230301 解决了【新的客户端连接后，会使得当前已连接的客户端主题强制恢复默认】的问题
    // 复现问题：删掉这里的return即可
    return
  }
  // store中有主题，使用该主题
  changeTheme(themeStore.globalTheme)
})

onBeforeUnmount(() => {
  proxy.$socket.unRegisterCallBack('themeChange')
})
</script>
