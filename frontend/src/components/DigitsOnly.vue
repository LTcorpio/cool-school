<template>
  <div class="com-container">
    <div class="digits">
      <div v-for="i in raw_data.data">
        <p :style="digitStyle.digit_title_style" class="digit-title">{{ i['aggr_name'] }}</p>
        <p :style="digitStyle.digit_value_style" class="digit-value">{{ i['aggr_count'] }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onBeforeMount, onBeforeUnmount, onMounted, reactive } from 'vue'

const { proxy } = getCurrentInstance();

let debounce = require('../utils/debounce').debounce

let raw_data = reactive({ "data": [] }),
    digitStyle = reactive({
      'digit_title_style': { 'font-size': 0 },
      'digit_value_style': { 'font-size': 0 },
    })

let iWantData = () => {
  proxy.$socket.send({
    action: 'getData',
    api: 'digits',
    socketType: 'digits'
  })
}

let getData = (resp) => {
  raw_data.data = resp.data
}

let screenAdapt = () => {
  let AdaptDomHeight = document.body.clientHeight / 30
  digitStyle.digit_title_style['font-size'] = AdaptDomHeight - 8 + 'px'
  digitStyle.digit_value_style['font-size'] = AdaptDomHeight + 'px'
}

onBeforeMount(() => {
  proxy.$socket.registerCallBack('digits', getData)
})

onMounted(() => {
  iWantData()
  screenAdapt()
  // 图表重置大小的防抖(debounce)
  window.addEventListener('resize', debounce(() => {
    screenAdapt()
  }, 200))
})

onBeforeUnmount(() => {
  proxy.$socket.unRegisterCallBack('digits')
})
</script>

<style lang="less" scoped>
.com-container {
  font-family: 'Cascadia Mono', 'Microsoft YaHei', monospace;
  font-weight: 700;
  background-color: var(--componentBgColor);
  color: var(--textColor)
}

.digits {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  text-align: center;

  justify-content: space-around;
  align-items: center;

  // 控制每行展示的个数
  > div {
    flex: 0 0 50%;

    > p {
      margin: 0;
    }
  }
}

</style>
