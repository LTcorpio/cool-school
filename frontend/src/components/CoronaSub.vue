<template>
  <div class="com-container">
    <div class="com-chart">
      <div ref="chartDom" class="chartDom"></div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, inject, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { debounce } from "@/utils/debounce";
import { option as chartOption } from "@/components/chartOptions/coronaBarChartOpt";
import useThemeStore from '@/store/modules/theme'

const themeStore = useThemeStore()
const { proxy } = getCurrentInstance();

const echarts = inject('echarts')

let chartDom = ref(null),
    myChart = null,
    chartData = reactive({ "data": [], "length": null }),
    dataZoomControl = reactive({
      startValue: 0,
      endValue: 4
    }), timer = ref(null)

let initChart = () => {
  myChart = echarts.init(chartDom.value, themeStore.chartTheme)
  myChart.setOption(chartOption)
}

let iWantData = () => {
  proxy.$socket.send({
    action: 'getData',
    api: 'corona',
    // TODO 实时爬虫还没有开发，开发完毕后将使用当日的日期，目前先使用历史数据
    api_body: { begin: '2022-12-04', end: '2022-12-04' },
    socketType: 'corona_latest'
  })
}

let getData = async (resp) => {
  chartData.data = resp.data.map(item => {
    return { "二级学院": item['secondary_college'], "填报率": item['ratio'].replace('%', '') }
  })
  chartData.length = chartData.data.length

  myChart.setOption({
    title: { text: `各分院疫情填报率(2022-12-18)` },
    dataset: { source: chartData.data }
  })
}

let barNumberLocResize = function () {
  let width = myChart.getWidth()
  let opt = myChart.getOption()
  let grid = opt.grid[0]
  let right = grid.right, left = grid.left
  right = width * parseFloat(right) / 100
  left = width * parseFloat(left) / 100
  let x = (width - left - right) + myChart.getHeight() / 8
  myChart.setOption({
    series: {
      id: 'sub_data', label: { show: true, position: 'left', offset: [ x, 0 ] }
    }
  })
}

let screenAdapt = () => {
  // 实时获取当前图表的高度(注意组合式API获取高度的方法)
  let domHeight = chartDom.value?.clientHeight,
      AdaptDomHeight = domHeight / 30
  // 高度小于600：开始轮播
  if (domHeight < 600) {
    if (timer.value) clearInterval(timer.value)
    dataZoomSetter()
    startInterval()
    myChart.on('mouseover', () => { clearInterval(timer.value) })
    myChart.on('mouseout', () => { startInterval() })
  } else {
    clearInterval(timer.value)
    timer.value = null
    // 通过设置dataZoom.endValue来显示全部数据
    myChart.setOption({
      dataZoom: { endValue: 100 }
    })
    // 解绑鼠标事件，图表恢复滚动
    myChart.off('mouseover')
    myChart.off('mouseout')
  }

  // 根据当前DOM的高度，动态调整字体大小
  myChart.setOption({
    title: { textStyle: { fontSize: AdaptDomHeight + 10 } },
    xAxis: { axisLabel: { fontSize: AdaptDomHeight / 1.5 } },
    series: [
      {
        id: 'sub_name',
        label: { fontSize: AdaptDomHeight / 1.2, color: themeStore.globalTheme === 'dark' ? '#eee' : '#333' }
      },
      { id: 'sub_data', type: 'bar', label: { fontSize: AdaptDomHeight } }
    ]
  })
  myChart.resize()
}

let startInterval = () => {
  if (timer.value) clearInterval(timer.value)
  timer.value = setInterval(() => {
    dataZoomControl.startValue++
    dataZoomControl.endValue++
    if (dataZoomControl.endValue > chartData.length - 1) {
      dataZoomControl.startValue = 0
      dataZoomControl.endValue = 4
    }
    dataZoomSetter()
  }, 2000)
}, dataZoomSetter = () => {
  myChart.setOption({
    dataZoom: {
      startValue: dataZoomControl.startValue,
      endValue: dataZoomControl.endValue
    }
  })
}

let reloadComponent = () => {
  proxy.$socket.registerCallBack('corona_latest', getData)
  if (myChart) myChart.dispose()
  initChart()
  iWantData()
  screenAdapt()
  barNumberLocResize()
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
    barNumberLocResize()
  }, 200))
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
  timer.value = null
  proxy.$socket.unRegisterCallBack('corona_latest')
})

defineExpose({
  screenAdapt
})
</script>
