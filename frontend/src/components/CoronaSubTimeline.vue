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
import { option as chartOption } from "@/components/chartOptions/coronaTimelineChartOpt";
import useThemeStore from '@/store/modules/theme'
import dayjs from 'dayjs'

const themeStore = useThemeStore()
const { proxy } = getCurrentInstance();

const echarts = inject('echarts')
import '@/utils/EChartsThemes/dark'

let chartDom = ref(null), myChart = null

let initChart = () => {
  myChart = echarts.init(chartDom.value, themeStore.chartTheme)
}

let iWantData = () => {
  proxy.$socket.send({
    action: 'getData',
    api: 'corona',
    api_body: { begin: '2022-09-01', end: dayjs().format('YYYY-MM-DD') },
    socketType: 'corona_all'
  })
}

let getData = (resp) => {
  let res = resp.data.reduce((obj, item) => {
    let currentDate = item['history_date'], secondary = item['secondary_college'], ratio = item['ratio']
    !(currentDate in obj) ? obj[currentDate] = {} : ''
    obj[currentDate][secondary] = +ratio.split("%")[0]
    return obj
  }, {})

  chartOption.baseOption.title[0].text = `本学期各分院疫情填报率历史数据排行 (${ Object.keys(res)[0] } 至 ${ Object.keys(res).slice(-1)[0] })`
  chartOption.baseOption.timeline.data = Object.keys(res)

  Object.entries(res).forEach(([date, obj]) => {
    let dataset = Object.entries(obj).map(([secondary, ratio]) => {
      return { "二级学院": secondary, "填报率": ratio }
    })

    let average = (dataset.map(item => item['填报率']).reduce((a, b) => a + b) / dataset.length).toFixed(2)

    chartOption.options.push({
      title: { id: 'subTitle', text: date, subtext: `填报率平均值：${average}%` },
      yAxis: { data: dataset.map(item => item['二级学院']) },
      series: {
        data: dataset.map(item => item['填报率']),
        markLine: { data: [ { xAxis: average } ] }
      }
    })
  })

  myChart.setOption(chartOption)
  screenAdapt()
}

let screenAdapt = () => {
  let AdaptDomHeight = chartDom.value?.clientHeight / 30
  myChart.setOption({ baseOption: {
    title: [
      { id: 'mainTitle', textStyle: { fontSize: AdaptDomHeight + 10 } },
      {
        id: 'subTitle',
        textStyle: {
          fontSize: AdaptDomHeight * 2,
          color: themeStore.globalTheme === 'dark' ? '#eee' : '#222',
          textShadowColor: themeStore.globalTheme === 'dark' ? '#ccc' : '#333'
        },
        subtextStyle: {
          fontSize: AdaptDomHeight * 1.2,
          color: themeStore.globalTheme === 'dark' ? '#bbb' : '#555',
          textShadowColor: themeStore.globalTheme === 'dark' ? '#888' : '#aaa'
        }
      }
    ],
    xAxis: { axisLabel: { fontSize: AdaptDomHeight / 1.5 } },
    yAxis: { axisLabel: { fontSize: AdaptDomHeight / 1.5 } },
    timeline: {
      label: { fontSize: AdaptDomHeight / 2 },
      emphasis: { label: { fontSize: AdaptDomHeight / 1.8 } },
      progress: { label: { fontSize: AdaptDomHeight / 2 } }
    },
    series: {
      type: 'bar',
      label: { fontSize: AdaptDomHeight / 1.4 },
      markLine: { label: { fontSize: AdaptDomHeight / 1.6 } }
    }
  } })
  myChart.resize()
}

let reloadComponent = () => {
  proxy.$socket.registerCallBack('corona_all', getData)
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
  proxy.$socket.unRegisterCallBack('corona_all')
})
</script>
