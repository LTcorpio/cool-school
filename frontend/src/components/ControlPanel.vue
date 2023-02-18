<template>
  <div class="com-container">
    <div class="panel">
      <!-- 主题切换单选 -->
      <div class="btn-group" role="group">
        <input id="dark_mode" :checked="themeStore.globalTheme === 'dark'" autocomplete="off" class="btn-check" name="btn-radio"
               type="radio" @change="changeTheme('dark')">
        <label class="btn btn-outline-secondary" for="dark_mode"><i class="bi bi-moon"></i></label>
        <input id="light_mode" :checked="themeStore.globalTheme === 'light'" autocomplete="off" class="btn-check" name="btn-radio"
               type="radio" @change="changeTheme('light')">
        <label class="btn btn-outline-secondary" for="light_mode"><i class="bi bi-sun"></i></label>
      </div>
      <button class="btn btn-outline-secondary">
        <i class="bi bi-database-gear"></i>
        立即更新数据
      </button>
      <button class="btn btn-outline-secondary" data-bs-target="#contactModal" data-bs-toggle="modal">
        <i class="bi bi-question-circle"></i>
        问题反馈
      </button>
    </div>
  </div>

  <!-- 联系作者（问题反馈）功能模块 -->
  <div id="contactModal" aria-hidden="true" aria-labelledby="contactModalLabel" class="modal fade"
       data-bs-backdrop="static"
       data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="contactModalLabel" class="modal-title">
            <i class="bi bi-app-indicator"></i>
            联系作者
          </h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <div v-if="submitForm.tipLevel !== 0" ref="tipAlert" v-html="submitForm.tipAlert"></div>
          <div class="form-floating mt-3 mb-3">
            <input id="title" v-model="submitForm.title" class="form-control" placeholder="标题" type="text">
            <label for="title">标题</label>
          </div>
          <div class="form-floating mb-3">
            <textarea id="comment" v-model="submitForm.msg" class="form-control" placeholder="内容" required
                      style="height: 160px"></textarea>
            <label for="comment">内容（必填项）</label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">取消</button>
          <button class="btn btn-primary" type="button" @click="submitMsg()">发送</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { getCurrentInstance, onBeforeMount, onBeforeUnmount, reactive } from 'vue'
import dayjs from 'dayjs'
import useThemeStore from '@/store/modules/theme'

const themeStore = useThemeStore()

const { $socket } = getCurrentInstance().appContext.config.globalProperties;

let submitForm = reactive({
  title: '',
  msg: '',
  tipLevel: 0,  // 0-不显示，1-未输入，2-推送失败，3-推送成功
  tipAlert: ''
})
let submitMsg = () => {
  if (submitForm.msg.replace(/\s/g, "") === '') {
    submitForm.tipLevel = 1
    submitForm.tipAlert = `<div class="alert alert-primary" role="alert">请输入需要推送的内容！</div>`
  } else {
    const params = new URLSearchParams();
    params.append('param1', 'value1');
    params.append('param2', 'value2');
    submitForm.tipAlert = `<div class="alert alert-secondary" role="alert">推送中</div>`
    $http({
      method: 'post',
      url: `https://api.day.app/cKmqmUBKKyzSYt5CCgDxED${ submitForm.title !== '' ? '/' + submitForm.title : '' }/${ submitForm.msg }`
    }).then(res => {
      submitForm.tipLevel = 3
      submitForm.tipAlert = `<div class="alert alert-success" role="alert">推送成功！${ dayjs(res.data.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss') }</div>`
    }).catch(err => {
      submitForm.tipLevel = 2
      submitForm.tipAlert = `<div class="alert alert-danger" role="alert">推送失败！${ err.message }</div>`
    })
  }
}

let changeTheme = (themeName) => {
  $socket.send({
    action: 'themeChange',
    globalTheme: themeName,
    chartTheme: themeName === 'dark' ? 'dark' : 'walden',
    socketType: 'themeChange'
  })
}

let applyChangeTheme = (resp) => {
  themeStore.setGlobalTheme(resp.globalTheme)
  themeStore.setChartTheme(resp.chartTheme)
  document.documentElement.setAttribute('theme', resp.globalTheme)
}

// 默认主题为黑色，如果主题(在状态中)已存在则使用store的值
// [NOTICE] 多端同步，新的客户端连接后，会使得当前已连接的客户端主题恢复默认，
//          因为状态存储是localStorage，默认仅对当前浏览器有效
//          如果要实现新接入的客户端也要保留状态，只能够将状态存储在数据库中
onBeforeMount(() => {
  if (themeStore.globalTheme === '') {
    themeStore.setGlobalTheme('dark')
    themeStore.setChartTheme('dark')
  }
  changeTheme(themeStore.globalTheme)
  $socket.registerCallBack('themeChange', applyChangeTheme)
})

onBeforeUnmount(() => {
  $socket.unRegisterCallBack('themeChange')
})
</script>

<style lang="less" scoped>
.com-container {
  font-family: 'Cascadia Mono', 'Microsoft YaHei', monospace;
  font-weight: 700;
  background-color: var(--componentBgColor);
  color: var(--color);
}

.panel {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.modal {
  color: #161522;
}
</style>
