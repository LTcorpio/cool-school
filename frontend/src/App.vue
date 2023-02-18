<template>
    <!-- 路由页面，图表右键菜单禁用 -->
    <router-view @contextmenu.prevent />
</template>

<script setup>
import { provide } from "vue";
import * as echarts from "echarts";

provide("echarts", echarts);
</script>

<style lang="less">
#app {
  user-select: none;
}
</style>
