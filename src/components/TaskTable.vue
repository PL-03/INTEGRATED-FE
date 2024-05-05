<script setup>
import { convertToTitleCase } from "../libs/util.js"
import { useRouter } from "vue-router"
import { ref } from "vue"
import ConfirmationModal from "./ConfirmationModal.vue"
import { useToast, POSITION } from "vue-toastification"

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(["viewTask", "editTask", "taskDeleted"])
const router = useRouter()
const showConfirmationModal = ref(false)
const taskToDelete = ref(null)

const statusColors = {
  "No Status": "#9ca3af",
  "To Do": "#ffd1d1",
  Doing: "#fde047",
  Done: "#5cd052",
}

const getStatusText = (status) => {
  return convertToTitleCase(status) || status
}

const handleAddTask = () => {
  router.push({ name: "taskadd" })
  emit("add-task") // Emit add-task event
}

const handleViewTask = (task) => {
  emit("viewTask", task)
}

const handleEditTask = (task) => {
  router.push(`/task/${task.id}/edit`)
  emit("edit-task", task.id) // Emit edit-task event with task ID
}

const handleDeleteTask = (task) => {
  taskToDelete.value = task
  showConfirmationModal.value = true
}

const confirmDeleteTask = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v1/tasks/${taskToDelete.value.id}`,
      {
        method: "DELETE",
      }
    )

    if (response.ok) {
      showToast("The task has been deleted", "success")
      emit("taskDeleted") // Emit the "taskDeleted" event without the task ID
    } else if (response.status === 404) {
      showToast("An error has occurred, the task does not exist", "error")
    } else {
      showToast("An error occurred while deleting the task", "error")
    }
  } catch (error) {
    console.error("Error deleting task:", error)
    showToast("An error occurred while deleting the task", "error")
  } finally {
    showConfirmationModal.value = false
    taskToDelete.value = null
  }
}

const closeConfirmationModal = () => {
  showConfirmationModal.value = false
  taskToDelete.value = null
}

const showToast = (message, type) => {
  const toast = useToast() // Create a toast instance

  switch (type) {
    case "success-add":
      toast.success(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      })
      break
    case "success-update":
      toast.success(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      })
      break
    case "error":
      toast.error(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      })
      break
    default:
      toast(message)
  }
}
</script>

<template>
  <div>
    <h1 class="text-5xl font-bold mt-6">IT-Bangmod Kradan Kanban</h1>
  </div>

  <div class="mt-4 flex justify-center items-center">
    <button
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      @click="handleAddTask"
    >
      + Add Task
    </button>
  </div>

  <div class="mt-4 flex justify-center items-center">
    <table class="table-auto w-9/12 m-4">
      <thead class="bg-violet-200 border-b py-4">
        <tr>
          <th
            class="text-lg font-medium text-gray-900 px-4 py-2 text-left border-r"
          >
            #
          </th>
          <th
            class="text-lg font-medium text-gray-900 px-4 py-2 text-left border-r"
          >
            Title
          </th>
          <th
            class="text-lg font-medium text-gray-900 px-4 py-2 text-left border-r"
          >
            Assignees
          </th>
          <th class="text-lg font-medium text-gray-900 px-4 py-2 text-left">
            Status
          </th>
          <th class="text-lg font-medium text-gray-900 px-4 py-2 text-left">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(task, index) in tasks"
          :key="task.id"
          class="font-mono bg-yellow-50 border-b itbkk-item"
        >
          <td
            class="px-4 py-2 whitespace-nowrap text-m font-medium text-gray-900 border-r"
          >
            {{ index + 1 }}
          </td>
          <td
            class="break-all text-m text-gray-900 font-light px-4 py-2 whitespace-normal border-r itbkk-title"
          >
            <button @click="handleViewTask(task)">{{ task.title }}</button>
          </td>
          <td
            class="break-all text-m text-gray-900 font-light px-4 py-2 whitespace-normal border-r itbkk-assignees"
          >
            <span
              v-if="task.assignees"
              class="break-all text-m text-gray-900 font-light px-4 py-2 whitespace-normal border-r"
            >
              {{ task.assignees }}
            </span>
            <span v-else class="italic text-gray-500">Unassigned</span>
          </td>
          <td
            class="text-m text-gray-900 font-light px-4 py-2 whitespace-normal itbkk-status"
          >
            <button
              class="status font-bold py-2 px-4 rounded"
              :style="{ background: statusColors[getStatusText(task.status)] }"
            >
              {{ getStatusText(task.status) }}
            </button>
          </td>
          <td class="px-4 py-2">
            <button
              class="text-purple-600 hover:text-purple-400 mr-2"
              @click="handleEditTask(task)"
              disabled
            >
              Edit
            </button>
            <button
              class="text-red-600 hover:text-red-400"
              @click="handleDeleteTask(task)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <ConfirmationModal
    :show="showConfirmationModal"
    :taskTitle="taskToDelete?.title"
    @close="closeConfirmationModal"
    @confirm="confirmDeleteTask"
  />
</template>

<style scoped>
.color-style {
  font-size: 1.3em;
}
border-r {
  border-right: 1px solid #e2e8f0;
}
.status {
  width: 120px;
}
</style>
