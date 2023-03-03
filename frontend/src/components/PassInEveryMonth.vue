<template>
  <div class="com-container">
    <div class="com-chart">
      <div ref="chartDom" class="chartDom"></div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { debounce } from "@/utils/debounce";
import { option as chartOption } from '@/components/chartOptions/passinCalendarOpt'
import dayjs from "dayjs";
import useThemeStore from '@/store/modules/theme'

const themeStore = useThemeStore()
const { proxy } = getCurrentInstance();

const echarts = inject('echarts')

// 组件传参，父组件需要传入两个参数图表方可正常显示
const props = defineProps({
  year: Number,
  month: Number,
  source: String
})

let chartDom = ref(null),
    myChart = null

let initChart = () => {
  myChart = echarts.init(chartDom.value, themeStore.chartTheme)
}

let iWantData = () => {
  proxy.$socket.send({
    action: 'getData',
    api: 'pass_in_out',
    api_body: {
      begin: dayjs().subtract(3, 'month').startOf('month').format("YYYY-MM-DD"),
      end: dayjs().format('YYYY-MM-DD'),
      source: props.source
    },
    socketType: 'pass_in_out_all'
  })
}

let getData = (resp) => {
  chartOption.dataset.source = resp.data.reduce((obj, item) => {
    if (dayjs(item['date']).year() === props.year && dayjs(item['date']).month() + 1 === props.month) {
      obj.push({ "name": item['date'], "value": item[props.source] })
    }
    return obj
  }, [])

  chartOption.calendar.range = [ `${ props.year }-${ props.month }` ]

  myChart.setOption(chartOption)
}

let screenAdapt = () => {
  // 实时获取当前图表的高度(注意组合式API获取高度的方法)
  let AdaptDomHeight = chartDom.value?.clientHeight / 30
  // 根据当前DOM的高度，动态调整字体大小
  chartOption.title.text = `${ props.year }年${ props.month }月${ props.source === 'in_count' ? '进校' : '出校' }人数统计`
  chartOption.title.textStyle['fontSize'] = AdaptDomHeight + 10
  chartOption.tooltip.textStyle['fontSize'] = AdaptDomHeight
  chartOption.calendar['cellSize'] = [ AdaptDomHeight * 4, AdaptDomHeight * 4 ]
  chartOption.calendar.dayLabel['fontSize'] = AdaptDomHeight
  chartOption.calendar.dayLabel['color'] = themeStore.globalTheme === 'dark' ? '#eee' : '#333'
  chartOption.calendar.monthLabel['fontSize'] = AdaptDomHeight
  chartOption.series.name = props.source === 'in_count' ? '进校人数' : '出校人数'
  chartOption.series.label['fontSize'] = AdaptDomHeight
  chartOption.series.emphasis.label['fontSize'] = AdaptDomHeight * 1.28

  myChart.setOption(chartOption)
  myChart.resize()
}

let reloadComponent = () => {
  proxy.$socket.registerCallBack('pass_in_out_all', getData)
  if (myChart)  myChart.dispose()
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
  proxy.$socket.unRegisterCallBack('pass_in_out_all')
})

defineExpose({
  screenAdapt
})

// ScreenPage中选择日期后，监听到props变化，此时重新获得数据
watch(props, () => {
  iWantData()
  screenAdapt()
})
</script>
