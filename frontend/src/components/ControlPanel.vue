<template>
  <div class="com-container">
    <div class="panel">
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

      <!-- 问题反馈/留言板 -->
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
            <select id="device" v-model="submitForm.device" class="form-select">
              <option value="1" selected>LTcorpio</option>
            </select>
            <label for="device">推送设备</label>
          </div>
          <div class="form-floating mb-3">
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
          <div class="col text-start">
            内容尽可能简短，勿包含特殊字符。如果问题较复杂，请
            <a href="mailto:ltcorpio@outlook.com" class="btn btn-sm btn-outline-success">发送邮件</a> 。
          </div>
          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">取消</button>
          <button :disabled="buttonDisabled" class="btn btn-primary" type="button" @click="submitMsg()"
                  v-text="buttonText"></button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { computed, getCurrentInstance, onBeforeMount, onBeforeUnmount, reactive, ref } from 'vue'
import dayjs from 'dayjs'

import useThemeStore from '@/store/modules/theme'
const themeStore = useThemeStore()

const { proxy } = getCurrentInstance();

// 问题反馈功能实现
let userListMap = { '1': [ 'LTcorpio', 'cKmqmUBKKyzSYt5CCgDxED' ] },
    submitForm = reactive({
      device: '1',
      title: '',
      msg: '',
      tipLevel: 0,  // 0-不显示，1-未输入，2-推送失败，3-推送成功
      tipAlert: ''
    })
let submitMsg = () => {
  let title = submitForm.title.replace(/\s/g, ""), content = submitForm.msg.replace(/\s/g, "")
  if (content === '') {
    submitForm.tipLevel = 1
    submitForm.tipAlert = `<div class="alert alert-primary" role="alert">请输入需要推送的内容！</div>`
  } else {
    const params = new URLSearchParams();
    params.append('param1', 'value1');
    params.append('param2', 'value2');
    submitForm.tipAlert = `<div class="alert alert-secondary" role="alert">推送中</div>`
    title = title.replace(/\//g, "")
    content = content.replace(/\//g, "")
    proxy.$http({
      method: 'post',
      url: `https://api.day.app/${ userListMap[submitForm.device][1] }${ title !== '' ? '/' + title : '' }/${ content }`
    }).then(res => {
      // 如果消息发送成功，则设置间隔（发送成功时的时间存储在localStorage中，按钮是否可点击取决于该值）
      localStorage.setItem("sendDataTime", dayjs().unix().toString())
      // 验证按钮是否可用：设置间隔时、页面加载时。
      judgingButtonAvail()
      submitForm.tipLevel = 3
      submitForm.tipAlert = `<div class="alert alert-success" role="alert">消息于 ${ dayjs(res.data.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss') } 成功推送给 ${ userListMap[submitForm.device][0] }。</div>`
    }).catch(err => {
      submitForm.tipLevel = 2
      submitForm.tipAlert = `<div class="alert alert-danger" role="alert">推送失败！${ err.message }</div>`
    })
  }
}

// 以下是对发送间隔的限制，此处使用computed计算属性
const countDown = ref(0)
const buttonText = computed(() => countDown.value === 0 ? '发送' : `${ countDown.value }s后可再次发送`)
const buttonDisabled = computed(() => countDown.value !== 0)
let judgingButtonAvail = () => {
  // 直接从localStorage中读取上一次发送消息的时间戳
  const lastTime = localStorage.getItem("sendDataTime")
  if (lastTime) {
    // 如果上一次发送过，lastTime一定有值，作差取间隔秒数
    // 如果是首次加载，lastTime没有值，则什么都不做，初始值在computed计算属性中已给定
    let timeDiff = dayjs().unix() - Number(localStorage.getItem("sendDataTime"))
    countDown.value = timeDiff > 30 ? 0 : 30 - timeDiff
    if (countDown.value > 0) {
      const timer = setInterval(() => {
        countDown.value--;
        if (countDown.value === 0) {
          clearInterval(timer)
        }
      }, 1000);
    }
  }
}

// 更换主题功能实现
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
/* [NOTICE]
   默认主题为黑色，如果主题在store中已存在则直接使用，可实现多个客户端同步到同一主题
   多端同步，新的客户端连接后，会使得当前已连接的客户端主题恢复默认，
   因为状态存储是localStorage，默认仅对当前浏览器有效
   如果要实现新接入的客户端也要保留状态，只能够将状态存储在数据库中
 */

onBeforeMount(() => {
  // 组件挂载前调用该函数，判断留言板的发送按钮是否可用，控制发送消息的频次
  judgingButtonAvail()

  proxy.$socket.registerCallBack('themeChange', applyChangeTheme)

  // store中没有主题，设置默认主题为黑色
  if (themeStore.globalTheme === '') {
    themeStore.setGlobalTheme('dark')
    themeStore.setChartTheme('dark')
  }
  // store中有主题，使用该主题
  changeTheme(themeStore.globalTheme)
  // proxy.$socket.registerCallBack('themeChange', applyChangeTheme)
})

onBeforeUnmount(() => {
  proxy.$socket.unRegisterCallBack('themeChange')
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
</style>
