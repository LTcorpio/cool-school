<template>
    <div class="com-page">
        <!-- 两个图表实现左右切换 -->
      <div id="chartControls" ref="chartControls" :class="themeStore.globalTheme === 'dark' ? 'carousel carousel-light slide' : 'carousel carousel-dark slide'" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#chartControls" data-bs-slide-to="0" class="active" aria-current="true"></button>
          <button type="button" data-bs-target="#chartControls" data-bs-slide-to="1"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <PrimaryGender ref="primary" />
          </div>
          <div class="carousel-item">
            <SecondaryGender ref="secondary" />
          </div>
        </div>
        <button id="prev" class="carousel-control-prev" type="button" data-bs-target="#chartControls" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">上一个</span>
        </button>
        <button id="next" class="carousel-control-next" type="button" data-bs-target="#chartControls" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">下一个</span>
        </button>
      </div>
    </div>
</template>

<script setup>
import PrimaryGender from '@/components/PrimaryGender'
import SecondaryGender from '@/components/SecondaryGender'
import { ref, onMounted, nextTick } from "vue";
import useThemeStore from '@/store/modules/theme'

const themeStore = useThemeStore()
console.log(themeStore.globalTheme)

let chartControls = ref(), primary = ref(), secondary = ref()

onMounted(() => {
  chartControls.value.addEventListener('slide.bs.carousel', () => {
    // slide.bs.carousel	调用幻灯片实例方法时立即激活. 监听此事件的变化即可
    // 切换后，待DOM加载完毕后(nextTick)让图表重新适应(screenAdapt)
    nextTick(() => {
      primary.value.screenAdapt()
      secondary.value.screenAdapt()
    })
  })
})
</script>

<style scoped>
#chartControls,
.carousel-item,
.carousel-inner {
  height: 100%;
}
</style>
