<template>
  <div class="com-container">
    <div class="com-chart">
      <div ref="chartDom" class="chartDom"></div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, inject, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import { debounce } from "@/utils/debounce";
import { option as chartOption } from "@/components/chartOptions/genderBarChartOpt";
import useThemeStore from '@/store/modules/theme'

const themeStore = useThemeStore()
const echarts = inject('echarts')
const { $socket } = getCurrentInstance().appContext.config.globalProperties;

let chartDom = ref(null),
    domHeight = ref(null),
    // 获得的 echarts 实例，不能够用响应式变量去接收，否则会报错（经过尝试，饼图不会报错）
    myChart = null

let initChart = () => {
  myChart = echarts.init(chartDom.value, themeStore.chartTheme)
  domHeight.value = chartDom.value?.clientHeight
}

let iWantData = () => {
  $socket.send({
    action: 'getData',
    api: 'gender',
    api_body: { range: 'secondary' },
    socketType: 'gender_secondary'
  })
}

let getData = (resp) => {
  // 以人数降序排序所对应的分院列表
  let res = resp.data.reduce((obj, item) => {
    let sec_college = item['secondary_college'], gender = item['gender'], count = item['count']
    !(sec_college in obj) ? obj[sec_college] = {} : ""
    obj[sec_college][gender] = count
    return obj
  }, {})

  let sec_ordered = Object.entries(res).map(([ sec_college, gender_dict ]) => {
    return { "二级学院": sec_college, "总人数": gender_dict['男'] + gender_dict['女'] }
  }).sort((a, b) => a['总人数'] - b['总人数']).map(item => item['二级学院'])

  // 根据分院列表，依次查询得到各分院男女数量
  chartOption.dataset.source = sec_ordered.reduce((obj, college) => {
    Object.entries(res).forEach(item => {
      item[0] === college ? obj.push({ "二级学院": college, "男": item[1]['男'], "女": item[1]['女'] }) : ''
    })
    return obj
  }, [])

  // 重置图表大小后，y轴字体没有自适应，使用此方法临时解决
  chartOption.yAxis.axisLabel.fontSize = domHeight.value / 30 / 1.2
  myChart.setOption(chartOption)
}

let screenAdapt = () => {
  // 实时获取当前图表的高度(注意组合式API获取高度的方法)
  domHeight.value = chartDom.value?.clientHeight
  let AdaptDomHeight = domHeight.value / 30
  // 根据当前DOM的高度，动态调整字体大小
  myChart.setOption({
    title: { textStyle: { fontSize: AdaptDomHeight + 10 } },
    legend: { textStyle: { fontSize: AdaptDomHeight } },
    xAxis: { axisLabel: { fontSize: AdaptDomHeight / 1.2 } },
    yAxis: { axisLabel: { fontSize: AdaptDomHeight } },
    series: [
      // 加入type，避免控制台报错：[ECharts] Unkown series undefined
      { type: 'bar', label: { fontSize: AdaptDomHeight / 1.2 } },
      { type: 'bar', label: { fontSize: AdaptDomHeight / 1.2 } }
    ]
  })

  myChart.resize()
}

let reloadComponent = () => {
  $socket.registerCallBack('gender_secondary', getData)
  if (myChart) myChart.dispose()
  initChart()
  iWantData()
  screenAdapt()
}

themeStore.$subscribe(() => {
  if (myChart !== null) {
    reloadComponent()
  }
})

onMounted(() => {
  reloadComponent()
  // 图表重置大小的防抖(debounce)
  window.addEventListener('resize', debounce(() => {
    screenAdapt()
  }, 200))
})

onBeforeUnmount(() => {
  $socket.unRegisterCallBack('gender_secondary')
})

defineExpose({
  screenAdapt
})
</script>
