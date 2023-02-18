<template>
  <div class="com-container">
    <div class="com-chart">
      <div ref="chartDom" class="chartDom"></div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { debounce } from "@/utils/debounce";
import { option as chartOption } from "@/components/chartOptions/digitsRosePieChartOpt";
import useThemeStore from '@/store/modules/theme'

const themeStore = useThemeStore()

const { $socket } = getCurrentInstance().appContext.config.globalProperties;

const echarts = inject('echarts')

let chartDom = ref(null),
    domHeight = ref(0),
    myChart = null

let initChart = () => {
  myChart = echarts.init(chartDom.value, themeStore.chartTheme)
  domHeight.value = chartDom.value?.clientHeight
}

let iWantData_1 = () => {
  $socket.send({
    action: 'getData',
    api: 'studentAgg',
    socketType: 'studentAgg'
  })
}

let iWantData_2 = () => {
  $socket.send({
    action: 'getData',
    api: 'departmentAgg',
    socketType: 'departmentAgg'
  })
}

let getData_stu = (resp) => {
  chartOption.dataset[0].source = resp.data
  myChart.setOption(chartOption)
}

let getData_dept = (resp) => {
  chartOption.dataset[1].source = resp.data
  myChart.setOption(chartOption)
}

let screenAdapt = () => {
  // 实时获取当前图表的高度(注意组合式API获取高度的方法)，也可以使用ECharts自带的API：myChart.getHeight()获取高度
  domHeight.value = chartDom.value?.clientHeight
  let AdaptDomHeight = domHeight.value / 30
  // 根据当前DOM的高度，动态调整字体大小
  myChart.setOption({
    title: [
      { id: 'title', textStyle: { fontSize: AdaptDomHeight + 10 } },
      { id: 'subtitle1', textStyle: { fontSize: AdaptDomHeight } },
      { id: 'subtitle2', textStyle: { fontSize: AdaptDomHeight } },
    ],
    // 有type一定要把type写上，不然第一次加载时没有自适应
    legend: { type: 'scroll', textStyle: { fontSize: AdaptDomHeight / 1.8 }, pageTextStyle: { color: themeStore.globalTheme } },
    series: [
      {
        id: 'stu',
        type: 'pie',
        emphasis: { label: { fontSize: AdaptDomHeight / 1.2 } }
      },
      {
        id: 'dept',
        type: 'pie',
        emphasis: { label: { fontSize: AdaptDomHeight / 1.2 } }
      }
    ]
  })
  myChart.resize()
}

let reloadComponent = () => {
  // 图表放大后，在Modal中的模态框也注册了回调，此时大屏的回调失效
  // 模态框销毁后，再次切换主题将导致图表无法加载，因为此时的回调已经被占用，没有及时注册
  // 所以主题变化后，需要及时注册回调。
  $socket.registerCallBack('studentAgg', getData_stu)
  $socket.registerCallBack('departmentAgg', getData_dept)
  if (myChart) myChart.dispose()
  initChart()
  iWantData_1()
  iWantData_2()
  screenAdapt()
}

// Pinia 订阅事件 监听store的变化 执行回调函数
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
  $socket.unRegisterCallBack('studentAgg')
  $socket.unRegisterCallBack('departmentAgg')
})

// 暴露方法
// 当Bootstrap的Modal显示后需要调用screenAdapt方法来重新适应图表
defineExpose({
  screenAdapt
})
</script>
