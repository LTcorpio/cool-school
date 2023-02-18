<template>
  <div class="com-page">
    <!-- 两个图表实现左右切换 -->
    <span><i class="bi bi-chevron-left" @click="toLeft"></i></span>
    <span><i class="bi bi-chevron-right" @click="toRight"></i></span>
    <component :is="component_list[currentIndex].component"></component>
  </div>
</template>

<script setup>
import PrimaryGender from '@/components/PrimaryGender'
import SecondaryGender from '@/components/SecondaryGender'

import { ref } from 'vue'

let component_list = [
  { "name": "总院性别分布", "component": PrimaryGender },
  { "name": "分院性别分布", "component": SecondaryGender }
], currentIndex = ref(0)

let toLeft = () => {
  currentIndex.value--
  if (currentIndex.value < 0) { currentIndex.value = component_list.length - 1 }
}, toRight = () => {
  currentIndex.value++
  if (currentIndex.value > component_list.length - 1) { currentIndex.value = 0 }
}

defineExpose(() => {
  return component_list[currentIndex.value]
})
</script>

<style scoped>
.bi-chevron-left {
  position: absolute;
  left: 6%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 36px;
  z-index: 5;
  color: #fff;
}

.bi-chevron-right {
  position: absolute;
  right: 6%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 36px;
  z-index: 5;
  color: #fff;
}
</style>
