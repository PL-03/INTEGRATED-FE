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
const statuses = ref([])

const fetchTasks = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v2/tasks`)
    const data = await response.json()
    tasks.value = data
  } catch (error) {
    console.error("Error fetching tasks:", error)
  }
}
const getStatusText = (status) => {
  if (typeof status === "object" && status !== null) {
    return status.name || ""
  } else if (typeof status === "string") {
    return status.name || status
  } else {
    return "Unknown Status"
  }
}
const fetchTaskDetails = async (id) => {
  if (id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/v2/tasks/${id}`
      )
      if (response.ok) {
        const data = await response.json()
        selectedTask.value = data
      } else if (response.status === 404) {
        alert("The requested task does not exist")
        router.push({name:"tasklist"})
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

const fetchStatuses = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v2/statuses`)
    const data = await response.json()
    statuses.value = data
  } catch (error) {
    console.error("Error fetching statuses:", error)
  }
}
const sortData = (order = "Asc") => {
  tasks.value.sort((a, b) => {
    const statusA = getStatusText(a.status).toUpperCase()
    const statusB = getStatusText(b.status).toUpperCase()

    if (statusA < statusB) {
      return order === "Asc" ? -1 : 1
    }
    if (statusA > statusB) {
      return order === "Asc" ? 1 : -1
    }
    return 0
  })
}
onMounted(async () => {
  await fetchTasks()
  await fetchStatuses()
  fetchTaskDetails(taskId.value)
})

watch(
  taskId,
  (newTaskId) => {
    fetchTaskDetails(newTaskId)
  },
  { immediate: true }
)

const handleViewTask = (task) => {
  selectedTask.value = task
  router.push({ name: 'taskdetail', params: { taskId: task.id }})
}

const handleEditTask = (taskId) => {
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) {
    selectedTask.value = { ...task }
    showModal.value = true
  }
  console.log(showModal.value)
}

const handleAddTask = () => {
  showModal.value = true
  selectedTask.value = {}
}
</script>

<template>
  <TaskTable
    :tasks="tasks"
    @view-task="handleViewTask"
    @edit-task="handleEditTask"
    @add-task="handleAddTask"
    @task-deleted="fetchTasks"
    @direction="sortData"
  />
  <AddEditModal
    v-if="isAddMode || isEditMode"
    :show="showModal"
    :task="isEditMode ? selectedTask : {}"
    :statuses="statuses"
    @update:show="showModal = $event"
    @task-added="fetchTasks"
    @task-updated="fetchTasks"
  />
  <PopupModal v-if="isViewMode" :selectedTaskId="selectedTask" />
</template>
