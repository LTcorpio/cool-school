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
import { option as chartOption } from "@/components/deprecated_components/coronaRaceChartOpt";

const { $http } = getCurrentInstance().appContext.config.globalProperties;

const echarts = inject('echarts')
import '@/utils/EChartsThemes/dark'

let chartDom = ref(null),
    myChart = null, timer = ref(null),
    dateRange = reactive({
      start: '', end: ''
    })

let initChart = () => {
  myChart = echarts.init(chartDom.value, 'dark')
  myChart.setOption(chartOption)  // 第一次一定要先初始化
}

let getData = async () => {
  let res = await $http({
    method: 'GET',
    url: 'api/yqtb/race'
  })

  res = res.data.data.reduce((obj, item) => {
    let currentDate = item['日期'], secondary = item['二级学院'], ratio = item['填报率']
    !(currentDate in obj) ? obj[currentDate] = {} : ''
    obj[currentDate][secondary] = +ratio.split("%")[0]
    return obj
  }, {})

  dateRange.start = Object.keys(res)[0]
  dateRange.end = Object.keys(res).slice(-1)[0]
  myChart.setOption({ title: { text: `各分院疫情填报率历史数据排行 (${dateRange.start} ~ ${dateRange.end})` } })

  Object.entries(res).forEach(([date, obj], index) => {
    let dataset = Object.entries(obj).map(([k, v]) => {
      return { "分院": k, "填报率": v }
    })
    // 根据数据下标设定延时，实现每隔一段时间更新一下图表
    timer.value = setTimeout(() => {
      updateChart(date, dataset);
    }, (index + 1) * 800);
  })
}

let screenAdapt = () => {
  let AdaptDomHeight = chartDom.value?.clientHeight / 30
  myChart.setOption({
    title: { textStyle: { fontSize: AdaptDomHeight + 10 } },
    xAxis: { axisLabel: { fontSize: AdaptDomHeight / 1.2 } },
    yAxis: { axisLabel: { fontSize: AdaptDomHeight / 1.2 } },
    graphic: [
      { id: 'mainTitle', type: 'text', style: { fontSize: AdaptDomHeight * 2 } },
      { id: 'subTitle', type: 'text', style: { fontSize: AdaptDomHeight * 1.2 } }
    ],
    series: {
      type: 'bar',
      label: { fontSize: AdaptDomHeight },
      markLine: { label: { fontSize: AdaptDomHeight / 1.4 } }
    }
  })
  myChart.resize()
}

let updateChart = (someday, daydata) => {
  let average = (daydata.map(item => item['填报率']).reduce((a, b) => a + b) / daydata.length).toFixed(2)
  myChart.setOption({
    dataset: { source: daydata },
    graphic: [
      { id: 'mainTitle', type: 'text', style: { text: someday } },
      { id: 'subTitle', type: 'text', style: { text: `当日填报率平均值：${average}%` } }
    ],
    series: {
      type: 'bar',
      markLine: { data: [ { xAxis: average } ] }
    }
  })
}

onMounted(() => {
  initChart()
  getData()
  screenAdapt()
  // 图表重置大小的防抖(debounce)
  window.addEventListener('resize', debounce(() => {
    screenAdapt()
  }, 200))
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
  timer.value = null
})
</script>
