<template>
  <!-- 数据更新历史 -->
  <button class="btn btn-outline-secondary" data-bs-target="#changeHistoryModal" data-bs-toggle="modal">
    <i class="bi bi-clock-history"></i>
    数据更新历史
  </button>

  <!-- 数据更新历史功能模块 -->
  <div id="changeHistoryModal" aria-hidden="true" aria-labelledby="changeHistoryModalLabel" class="modal fade"
       data-bs-backdrop="static"
       data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="contactModalLabel" class="modal-title">
            <i class="bi bi-clock-history"></i>
            数据更新历史（最近 5 条）
          </h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-secondary" role="alert">
            仅展示当前浏览器捕获的数据更新，不回溯服务器历史更新。
          </div>
          <ol class="list-group list-group-numbered">
            <li class="list-group-item" v-for="item in updatedList.slice(-5)" v-text="item"></li>
          </ol>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { getCurrentInstance, onBeforeUnmount, onMounted, reactive } from "vue";
import dayjs from "dayjs";

const { proxy } = getCurrentInstance()

let updatedList = reactive([])

let getUpdatedData = (resp) => {
  // console.log("我是在ChangeHistoryModal中的更新后数据的处理函数")
  let logContent = `${ dayjs.unix(resp['timestamp']).format("YYYY-MM-DD HH:mm:ss") }，${ resp['updateChart'] }表发生变化，最新数据是：${ JSON.stringify(resp['data']) }。`
  updatedList.push(logContent)
}

onMounted(() => {
  proxy.$socket.registerCallBack('update_log', getUpdatedData)
})

onBeforeUnmount(() => {
  proxy.$socket.unRegisterCallBack('update_log')
})
</script>
