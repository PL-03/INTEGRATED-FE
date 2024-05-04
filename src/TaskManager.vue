<script setup>
import { ref, onMounted, watch, computed } from "vue"
import TaskTable from "./components/TaskTable.vue"
import PopupModal from "./components/PopupModal.vue"
import AddEditModal from "./components/AddEditModal.vue"
import { useRoute, useRouter } from "vue-router"

const tasks = ref([])
const selectedTask = ref({})
const route = useRoute()
const router = useRouter()
const taskId = computed(() => route.params.taskId || null)
const isAddMode = computed(() => route.name === "taskadd")
const isEditMode = computed(() => route.name === "taskedit")
const isViewMode = computed(() => route.name === "taskdetail")
const showModal = ref(false)

const fetchTasks = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/tasks`)
    const data = await response.json()
    tasks.value = data
  } catch (error) {
    console.error("Error fetching tasks:", error)
  }
}

const fetchTaskDetails = async (id) => {
  if (id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/v1/tasks/${id}`
      )
      if (response.ok) {
        const data = await response.json()
        selectedTask.value = data
      } else if (response.status === 404) {
        alert("The requested task does not exist")
        router.push("/task")
      } else {
        console.error("Error fetching task details:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching task details:", error)
    }
  } else {
    selectedTask.value = {}
  }
}

onMounted(async () => {
  await fetchTasks()
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
  <TaskTable
    :tasks="tasks"
    @view-task="
      (task) => {
        selectedTask = task
        router.push(`/task/${task.id}`)
      }
    "
    @edit-task="
      (taskId) => {
        selectedTask = tasks.find((task) => task.id === taskId)
        showModal = true
      }
    "
    @add-task="showModal = true"
  />
  <AddEditModal
    v-if="isAddMode || isEditMode"
    :show="showModal"
    :task="isEditMode ? selectedTask : {}"
    @update:show="showModal = $event"
    @task-added="fetchTasks"
    @task-updated="fetchTasks"
  />
  <PopupModal v-if="isViewMode" :selectedTaskId="selectedTask" />
</template>
