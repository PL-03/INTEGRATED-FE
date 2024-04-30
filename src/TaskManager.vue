<script setup>
import { ref, onMounted, watch, computed } from "vue"
import TaskTable from "./components/TaskTable.vue"
import PopupModal from "./components/PopupModal.vue"
import { useRoute, useRouter } from "vue-router"

const tasks = ref([])
const selectedTaskId = ref({})
const route = useRoute()
const router = useRouter()

const taskId = computed(() => route.params.taskId || null)

const fetchTaskDetails = async (taskId) => {
  if (taskId) {
    try {
      const taskDetails = await fetch(
        `${import.meta.env.VITE_BASE_URL}/v1/tasks/${taskId}`
      )
      if (taskDetails.ok) {
        const data = await taskDetails.json()
        selectedTaskId.value = data
      } else if (taskDetails.status === 404) {
        // Task not found, show alert
        alert("The requested task does not exist")
        // Redirect to task list page
        router.push("/task")
      } else {
        // Handle other errors if needed
        console.error("Error fetching task details:", taskDetails.statusText)
      }
    } catch (error) {
      console.error("Error fetching task details:", error)
    }
  } else {
    selectedTaskId.value = {}
  }
}

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/tasks`)
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
