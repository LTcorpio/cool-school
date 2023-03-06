<template>
  <!-- 问题反馈/留言板 -->
  <button class="btn btn-outline-secondary" data-bs-target="#contactModal" data-bs-toggle="modal">
    <i class="bi bi-question-circle"></i>
    问题反馈
  </button>

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
          <div v-if="respForm.tipLevel !== 0" ref="tipAlert" v-html="respForm.tipAlert"></div>
          <div class="form-floating mt-3 mb-3">
            <select id="device" v-model="submitForm.device" class="form-select">
              <option v-for="item in userListMap" v-text="item.person" :value="item.uid"></option>
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
            <a :href="'mailto:' + respForm.userInfo.email" class="btn btn-sm btn-outline-success">发送邮件</a> 。
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
import { computed, getCurrentInstance, onBeforeMount, reactive, ref } from 'vue'
import dayjs from 'dayjs'

const { proxy } = getCurrentInstance();

// 问题反馈功能实现
let userListMap = [
      { uid: 1, person: '娄星杰一号', appid: 'cKmqmUBKKyzSYt5CCgDxED', email: '1042045249@qq.com' },
      { uid: 2, person: '娄星杰二号', appid: 'cKmqmUBKKyzSYt5CCgDxED', email: 'ltcorpio5249@vip.qq.com' }
    ],
    submitForm = reactive({
      device: 1,
      title: '',
      msg: ''
    }),
    respForm = reactive({
      tipLevel: 0,  // 0-不显示，1-未输入，2-推送失败，3-推送成功
      tipAlert: '',
      userInfo: computed(() => userListMap[submitForm.device - 1])
    })

let submitMsg = () => {
  let title = submitForm.title.replace(/\s/g, ""),
      content = submitForm.msg.replace(/\s/g, "")
  if (content === '') {
    respForm.tipLevel = 1
    respForm.tipAlert = `<div class="alert alert-primary" role="alert">请输入需要推送的内容！</div>`
  } else {
    const params = new URLSearchParams();
    params.append('param1', 'value1');
    params.append('param2', 'value2');
    respForm.tipAlert = `<div class="alert alert-secondary" role="alert">推送中</div>`
    title = title.replace(/\//g, "")
    content = content.replace(/\//g, "")
    proxy.$http({
      method: 'post',
      url: `https://api.day.app/${ respForm.userInfo.appid }${ title !== '' ? '/' + title : '' }/${ content }`
    }).then(res => {
      // 如果消息发送成功，则设置间隔（发送成功时的时间存储在localStorage中，按钮是否可点击取决于该值）
      localStorage.setItem("sendDataTime", dayjs().unix().toString())
      // 验证按钮是否可用：设置间隔时、页面加载时。
      judgingButtonAvail()
      respForm.tipLevel = 3
      respForm.tipAlert = `<div class="alert alert-success" role="alert">消息于 ${ dayjs(res.data.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss') } 成功推送给 ${ respForm.userInfo.person }。</div>`
    }).catch(err => {
      respForm.tipLevel = 2
      respForm.tipAlert = `<div class="alert alert-danger" role="alert">推送失败！${ err.message }</div>`
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

onBeforeMount(() => {
  // 组件挂载前调用该函数，判断留言板的发送按钮是否可用，控制发送消息的频次
  judgingButtonAvail()
})
</script>
