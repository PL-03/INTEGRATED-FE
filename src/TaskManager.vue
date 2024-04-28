<script setup>
import { ref, onMounted, watch, computed } from "vue"
import TaskTable from "./components/TaskTable.vue"
import PopupModal from "./components/PopupModal.vue"
import { useRoute } from "vue-router"

const tasks = ref([])
const selectedTaskId = ref({})
const route = useRoute()

const taskId = computed(() => route.params.taskId || null)

const fetchTaskDetails = async (taskId) => {
  if (taskId) {
    const taskDetails = await fetch(
      `${import.meta.env.VITE_BASE_URL}/itb-kk/v1/tasks/${taskId}`
    )
    const data = await taskDetails.json()
    selectedTaskId.value = data
  } else {
    selectedTaskId.value = {}
  }
}

onMounted(async () => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/itb-kk/v1/tasks`
  )
  const data = await response.json()
  tasks.value = data

  fetchTaskDetails(taskId.value)
})

watch(
  taskId,
  (newTaskId) => {
    fetchTaskDetails(newTaskId)
  },
  { immediate: true }
)
</script>

<template>
  <TaskTable :tasks="tasks" />
  <PopupModal :selectedTaskId="selectedTaskId" />
</template>

<style scoped></style>
