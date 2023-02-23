<template>
  <div class="screen-container" @keyup.esc="chartClosed()">
    <header class="screen-header">
      <div class="logo">
        <img alt="" onload="SVGInject(this)" src="/svg/logo_standard.svg"/>
      </div>
      <div class="title">
        <span>智慧校园数据看板</span>
      </div>
      <div class="title-right">
        <span ref="datetime" class="datetime" v-text="currentTime"></span>
      </div>
    </header>

    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top">
          <div class="resize">
            <button :class="themeStore.globalTheme === 'dark' ? 'btn btn-dark' : 'btn btn-light'" data-bs-target="#expandedChartModal" data-bs-toggle="modal"
                    type="button" @click="setCurrentChartMeta('ltRef')">
              <span><i class="bi bi-three-dots"></i></span>
            </button>
          </div>
          <PrimaryGender ref="ltRef" v-if="componentMap.ltRef.show"></PrimaryGender>
        </div>
        <div id="left-bottom">
          <div class="resize">
            <button :class="themeStore.globalTheme === 'dark' ? 'btn btn-dark dropdown-toggle' : 'btn btn-light dropdown-toggle'" data-bs-toggle="dropdown" type="button">
              <i class="bi bi-calendar-date"></i>
            </button>
            <ul :class="themeStore.globalTheme === 'dark' ? 'dropdown-menu dropdown-menu-dark' : 'dropdown-menu'">
              <li class="dropdown-item disabled">请选择年月以查看历史数据</li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li>
                <a v-for="item in calendarControl.yearMonthList"
                   class="dropdown-item"
                   @click="changeYearMonth(item.join('-'))"
                   v-text="dayjs(item.join('-')).format('YYYY 年 MM 月')">
                </a>
              </li>
              <li class="dropdown-item disabled">（仅展示三个月以内的数据）</li>
            </ul>
          </div>
          <PassInEveryMonth :month="calendarControl.currentMonth"
                            :year="calendarControl.currentYear"></PassInEveryMonth>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top">
          <RegionMap ref="mtRef" v-if="componentMap.mtRef.show"></RegionMap>
          <div class="resize">
            <button :class="themeStore.globalTheme === 'dark' ? 'btn btn-dark' : 'btn btn-light'" data-bs-target="#expandedChartModal" data-bs-toggle="modal"
                    type="button" @click="setCurrentChartMeta('mtRef')">
              <span><i class="bi bi-arrows-angle-expand"></i></span>
            </button>
          </div>
        </div>
        <div id="middle-bottom">
          <DigitsOnly></DigitsOnly>
          <div class="resize">
            <button :class="themeStore.globalTheme === 'dark' ? 'btn btn-dark' : 'btn btn-light'" data-bs-target="#expandedChartModal" data-bs-toggle="modal"
                    type="button" @click="setCurrentChartMeta('mbRef')">
              <span><i class="bi bi-subtract"></i></span>
            </button>
          </div>
        </div>
        <div id="middle-control">
          <ControlPanel></ControlPanel>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top">
          <div class="btn-group resize" role="group">
            <!-- 用于展示race-bar -->
            <button :class="themeStore.globalTheme === 'dark' ? 'btn btn-dark' : 'btn btn-light'" data-bs-target="#expandedChartModal" data-bs-toggle="modal"
                    type="button" @click="setCurrentChartMeta('rtRef2')">
              <span><i class="bi bi-hourglass-split"></i></span>
            </button>
            <!-- 用于展示full-data -->
            <button :class="themeStore.globalTheme === 'dark' ? 'btn btn-dark' : 'btn btn-light'" data-bs-target="#expandedChartModal" data-bs-toggle="modal"
                    type="button" @click="setCurrentChartMeta('rtRef')">
              <span><i class="bi bi-arrows-angle-expand"></i></span>
            </button>
          </div>
          <CoronaSub ref="rtRef" v-if="componentMap.rtRef.show"></CoronaSub>
        </div>
        <div id="right-bottom">
          <div class="resize">
            <button :class="themeStore.globalTheme === 'dark' ? 'btn btn-dark' : 'btn btn-light'" data-bs-target="#expandedChartModal" data-bs-toggle="modal"
                    type="button" @click="setCurrentChartMeta('rbRef')">
              <span><i class="bi bi-arrows-angle-expand"></i></span>
            </button>
          </div>
          <SurnameWordcloud ref="rbRef" v-if="componentMap.rbRef.show"></SurnameWordcloud>
        </div>
      </section>
    </div>

    <div id="expandedChartModal" class="modal elementFaded" tabindex="-1">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="expandedChartLabel" class="modal-title" v-text="currentChart.chartName"></h3>
            <button class="btn-close" data-bs-dismiss="modal" type="button"
                    @click="chartClosed()"></button>
          </div>
          <div class="modal-body">
            <component :is="currentChart.chartComponent" v-if="currentChart.chartName !== ''"></component>
          </div>
        </div>
      </div>
    </div>

    <div class="position-fixed top-0 end-0 p-3" style="z-index: 1000000">
      <div id="liveToast" class="toast align-items-center text-white bg-secondary border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            该区域下没有地图数据。
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, markRaw, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'

import PrimaryGender from '@/components/PrimaryGender'
import GenderSwitchPage from '@/views/GenderSwitchPage'
import PassInEveryMonth from '@/components/PassInEveryMonth'
import RegionMap from '@/components/RegionMap'
import CoronaSub from '@/components/CoronaSub'
import CoronaSubTimeline from '@/components/CoronaSubTimeline'
import DigitsOnly from '@/components/DigitsOnly'
import DigitsDetails from '@/components/DigitsDetails'
import ControlPanel from '@/components/ControlPanel'
import SurnameWordcloud from '@/components/SurnameWordcloud'

import useThemeStore from '@/store/modules/theme'
const themeStore = useThemeStore()

import '@/utils/EChartsThemes/dark'
import '@/utils/EChartsThemes/walden'

const { $socket } = getCurrentInstance().appContext.config.globalProperties;

let componentMap = reactive({
  // 图表放大关闭后仅刷新指定图表而不是所有图表，指定图表是否显示即可
  ltRef: { show: true, component: markRaw(GenderSwitchPage), title: '学生性别分布（总院、分院）' },
  mtRef: { show: true, component: markRaw(RegionMap), title: '各省份生源数量' },
  mbRef: { show: true, component: markRaw(DigitsDetails), title: '在校人员所属部门分布' },
  rtRef: { show: true, component: markRaw(CoronaSub), title: '各分院疫情填报率' },
  rtRef2: { show: true, component: markRaw(CoronaSubTimeline), title: '各分院历史疫情填报率明细' },
  rbRef: { show: true, component: markRaw(SurnameWordcloud), title: '学生姓氏词云' },
})

let timer = ref(null), currentTime = ref(null)
let ltRef = ref(), mtRef = ref(), rtRef = ref(), rbRef = ref(),
    currentChart = reactive({
      chartRef: '',
      chartName: '',
      chartComponent: ''
    }),
    calendarControl = reactive({
      currentYear: dayjs().year(),
      currentMonth: dayjs().month() + 1,
      yearMonthList: null
    })

// 放大指定图表(动态绑定组件)
let setCurrentChartMeta = (chartRef) => {
  currentChart.chartRef = chartRef
  currentChart.chartName = componentMap[chartRef]['title']
  currentChart.chartComponent = markRaw(componentMap[chartRef]['component'])
  componentMap[chartRef].show = false
}

// 取消放大图表
let chartClosed = () => {
  componentMap[currentChart.chartRef].show = true
  currentChart.chartRef = null
  currentChart.chartName = null
  currentChart.chartComponent = null
}

// 获取日历组件下拉框数据
let iWantData = () => {
  $socket.send({
    action: 'getData',
    api: 'pass_in_out',
    api_body: {
      begin: dayjs().subtract(2, 'month').startOf('month').format("YYYY-MM-DD"),
      end: dayjs().format('YYYY-MM-DD')
    },
    socketType: 'pass_in_out_months'
  })
}

// 日历组件下拉框数据解析并对进出校日期动态绑定
// resp是WebSocket后端返回的数据体，不同于Axios，请求完毕后无需.data
let fetchDateAndSetProps = (resp) => {
  calendarControl.yearMonthList = resp['dataRange'].map(item => {
    return item.split("-")
  }).reverse()
}

// 日期选择后触发的事件(修改年份和月份)
let changeYearMonth = (year_month) => {
  let [ year, month ] = year_month.split("-")
  calendarControl.currentYear = +year
  calendarControl.currentMonth = +month
}

onBeforeMount(() => {
  $socket.registerCallBack('pass_in_out_months', fetchDateAndSetProps)
})

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = dayjs().format("YYYY-MM-DD HH:mm:ss")
  }, 1000)
  iWantData()
})

onBeforeUnmount(() => {
  window.clearInterval(timer)
  $socket.unRegisterCallBack('pass_in_out_months')
})

</script>

<style lang="less" scoped>
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: var(--bgColor);
  color: var(--textColor);
  box-sizing: border-box;
  transition: all 1.2s;
}

.screen-header {
  width: 100%;
  height: 72px;
  font-weight: 700;
  position: relative;

  .logo {
    top: 10%;
    height: 80%;
    position: absolute;

    svg {
      height: 100%;
      fill: var(--textColor)
    }
  }

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-family: '得意黑', 'Cascadia Mono', 'Microsoft YaHei', monospace;
    font-weight: 400;
    font-size: 42px;
  }

  .title-right {
    position: absolute;
    right: 0;
    top: 30%;
  }

  .datetime {
    font-family: 'Cascadia Mono', 'Microsoft YaHei', monospace;
    font-size: 24px;
    margin-left: 10px;
  }
}

.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 24px;

  .screen-left {
    height: 100%;
    width: 29%;

    #left-top {
      height: 40%;
      position: relative;
    }

    #left-bottom {
      height: 44%;
      margin-top: 25px;
      position: relative;
    }
  }

  .screen-middle {
    height: 100%;
    width: 38%;
    margin-left: 1.6%;
    margin-right: 1.6%;

    #middle-top {
      width: 100%;
      height: 56.5%;
      position: relative;
    }

    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 17%;
      position: relative;
    }

    #middle-control {
      margin-top: 25px;
      width: 100%;
      height: 8%;
    }
  }

  .screen-right {
    height: 100%;
    width: 30%;

    #right-top {
      height: 50%;
      position: relative;
    }

    #right-bottom {
      height: 34%;
      margin-top: 25px;
      position: relative;
    }
  }
}

.resize {
  position: absolute;
  right: 3%;
  top: 10px;
  cursor: pointer;
  z-index: 2;
}

.modal {
  color: #161522;
}

.elementFaded {
  -webkit-animation: fadein .5s ease;
}

@keyframes fadein {
  0% {
    opacity: 0
  }
  100% {
    opacity: 1
  }
}

@keyframes fadeout {
  0% {
    opacity: 1
  }
  100% {
    opacity: 0
  }
}
</style>
