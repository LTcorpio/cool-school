<template>
  <div class="com-container">
    <div class="panel">
      <!-- 主题切换 -->
      <theme-switch></theme-switch>

      <!-- 数据更新历史 -->
      <change-history-modal></change-history-modal>

      <!-- 问题反馈/留言板 -->
      <contact-modal></contact-modal>
    </div>
  </div>
</template>

<script setup>
import ThemeSwitch from './InteractComponents/ThemeSwitch.vue';
import ChangeHistoryModal from './InteractComponents/ChangeHistoryModal.vue';
import ContactModal from './InteractComponents/ContactModal.vue';
</script>

<style lang="less" scoped>
.com-container {
  font-family: 'Microsoft YaHei', monospace;
  background-color: var(--componentBgColor);
  color: var(--color);
}

.panel {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
