<template>
  <div class="com-container">
    <div class="com-chart">
      <div ref="chartDom" class="chartDom" @dblclick="backToChina"></div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { debounce } from "@/utils/debounce";
import { option as chartOption } from "@/components/chartOptions/regionMapChartOpt";
import useThemeStore from '@/store/modules/theme'
import bootstrap from 'bootstrap/dist/js/bootstrap'

const themeStore = useThemeStore()
const { proxy } = getCurrentInstance();

const echarts = inject('echarts')

let chartDom = ref(null), province = ref('china'),
    myChart = null,
    campus_location = {
      '北仑校区': [ 121.82080624467746, 29.892671327044276 ],
      '余姚校区（阳明学院）': [ 121.13539206306649, 30.020832866037505 ],
      '新典校区': [ 121.53108235210196, 29.85175503805963 ]
    }

let initChart = () => {
  let geoJson = require("../utils/GeoJsonData/geojson_province/100000_full.json")
  echarts.registerMap('china', { geoJSON: geoJson })
  myChart = echarts.init(chartDom.value, themeStore.chartTheme)
  myChart.setOption(chartOption)

  let allow_down_list = [ 'china', ...geoJson.features.reduce((obj, item) => {
    let province_name = item.properties.name
    if (province_name !== '') obj.push(province_name)
    return obj
  }, []) ]

  myChart.on('click', (e) => {
    if (e.componentSubType === 'map' && allow_down_list.includes(e.name)) {
      iWantDrillData(e.name)
    } else {
      // console.log("该区域下没有数据。")
      let toastLiveExample = document.getElementById('liveToast')
      let toast = new bootstrap.Toast(toastLiveExample)
      toast.show()
    }
  })
}

let iWantData = () => {
  proxy.$socket.send({
    action: 'getData',
    api: 'region',
    api_body: { province: '全国' },
    socketType: 'region_china'
  })
}

let iWantDrillData = (provinceName) => {
  proxy.$socket.send({
    action: 'getData',
    api: 'region',
    api_body: { province: provinceName },
    socketType: 'region_drill'
  })
}

let getData = (resp) => {
  province.value = 'china'

  myChart.setOption({
    geo: { type: 'map', map: 'china', zoom: 1.5, center: [ 105, 35 ] },
    series: [
      { type: 'map', data: resp.data },
      { type: 'effectScatter', data: [ { "name": "宁波职业技术学院", "value": campus_location['北仑校区'] } ] }
    ]
  })
}

let getDownData = (resp) => {
  let provinceId = resp['region_meta']['province_id'],
      provinceName = resp['region_meta']['province_name']
  province.value = provinceName

  // 注册新下钻数据的map
  let newMapJson = require(`../utils/GeoJsonData/geojson_city/${ provinceId }_full.json`)
  echarts.registerMap(provinceName, newMapJson)

  let campusDetails =
      provinceName === "浙江省"
        ? Object.entries(campus_location).map(([ campus, loc ]) => ({ "name": campus, "value": loc }))
        : [ { "name": "宁波职业技术学院", "value": campus_location['北仑校区'] } ]

  myChart.setOption({
    title: { text: provinceName + "生源数量" },
    geo: { type: 'map', map: province.value, zoom: 1, center: null },
    series: [
      { name: provinceName + "生源数量", type: 'map', data: resp.data },
      { type: 'effectScatter', data: campusDetails }
    ]
  })
}

let backToChina = () => {
  iWantData()
  myChart.setOption({
    title: { text: '各省份生源数量' },
    geo: { type: 'map', map: province.value, zoom: 1.5, center: [ 105, 35 ] },
    series: [ { name: '各省份生源数量', type: 'map' } ]
  })
}

let screenAdapt = () => {
  // 实时获取当前图表的高度(注意组合式API获取高度的方法)
  let AdaptDomHeight = chartDom.value?.clientHeight / 30
  // 根据当前DOM的高度，动态调整字体大小
  myChart.setOption({
    title: { textStyle: { fontSize: AdaptDomHeight + 10 } },
    visualMap: { textStyle: { fontSize: AdaptDomHeight / 1.5, color: themeStore.globalTheme === 'dark' ? '#eee' : '#333' } }
  })
  myChart.resize()
}

let reloadComponent = () => {
  proxy.$socket.registerCallBack('region_china', getData)
  proxy.$socket.registerCallBack('region_drill', getDownData)
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
  proxy.$socket.unRegisterCallBack('region_china')
  proxy.$socket.unRegisterCallBack('region_drill')
})

defineExpose({
  screenAdapt
})
</script>
