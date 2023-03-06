<template>
  <div class="com-container">
    <div class="com-chart">
      <div ref="chartDom" class="chartDom"></div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import "echarts-wordcloud/dist/echarts-wordcloud.min"
import { debounce } from "@/utils/debounce";
import { option as chartOption } from "@/components/chartOptions/wordcloudMapOpt";
import useThemeStore from '@/store/modules/theme'

const themeStore = useThemeStore()
const { proxy } = getCurrentInstance();

const echarts = inject('echarts')

let chartDom = ref(null),
    domHeight = ref(null),
    myChart = null

let initChart = () => {
  myChart = echarts.init(chartDom.value, themeStore.chartTheme)
  domHeight.value = chartDom.value?.clientHeight
}

let iWantData = () => {
  proxy.$socket.send({
    action: 'getData',
    api: 'surname',
    socketType: 'surname'
  })
}

let getData = (resp) => {
  chartOption.series.data = resp.data
}

let screenAdapt = () => {
  domHeight.value = chartDom.value?.clientHeight
  let AdaptDomHeight = domHeight.value / 30
  myChart.setOption(chartOption)
  myChart.setOption({
    title: { textStyle: { fontSize: AdaptDomHeight + 10 } },
    toolbox: {
      itemSize: AdaptDomHeight,
      feature: {
        dataView: {
          buttonColor: `${themeStore.globalTheme === 'dark' ? '#888' : '#333'}`,
          backgroundColor: `${themeStore.globalTheme === 'dark' ? '#333' : '#fff'}`,
          textColor: `${themeStore.globalTheme === 'dark' ? '#fff' : '#666'}`,
        }
      }
    },
    series: {
      type: 'wordCloud',
      sizeRange: [ AdaptDomHeight, AdaptDomHeight * 3 ],
    }
  })
  myChart.resize()
}

let reloadComponent = () => {
  proxy.$socket.registerCallBack('surname', getData)
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
  window.addEventListener('resize', debounce(() => {
    screenAdapt()
  }, 200))
})

onBeforeUnmount(() => {
  proxy.$socket.unRegisterCallBack('surname')
})

defineExpose({
  screenAdapt
})

// 加上watch 避免第一次加载时小图表不加载的情况
watch((chartOption), () => {
  screenAdapt()
})
</script>
