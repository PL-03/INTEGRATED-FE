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
  <div class="bg-gradient-to-t from-gray-700 to-blue-100">
  <div>
    <h1 class="text-5xl font-bold p-8">IT-Bangmod Kradan Kanban</h1>
  </div>

  <div class="mt-2 mr-52 flex justify-end items-center ">
    <button
      class="bg-green-500 hover:bg-green-700 text-white font-bold p-2 rounded"
      @click="handleAddTask"
    >
      + Add Task
    </button>
  </div>

  <div class="mt-4 flex justify-center items-center ">
    <table class="table-auto w-9/12 m-2 rounded-2xl overflow-hidden">
      <thead class="bg-blue-950 border-b py-4 text-white ">
        <tr>
          <th
            class="text-lg font-medium text-white px-4 py-2 text-left border-r"
          >
            #
          </th>
          <th
            class="text-lg font-medium text-white px-4 py-2 text-left border-r"
          >
            Title
          </th>
          <th
            class="text-lg font-medium text-white px-4 py-2 text-left border-r"
          >
            Assignees
          </th>
          <th class="text-lg font-medium text-white px-4 py-2 text-left">
            Status
          </th>
          <th class="text-lg font-medium text-white px-4 py-2 text-left">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(task, index) in tasks"
          :key="task.id"
          :class="index % 2 === 0 ? 'bg-sky-50' : 'bg-yellow-50'"
          class="font-mono border-b itbkk-item"
          >
          <td
            class=" px-4 py-2 whitespace-nowrap text-m font-medium text-gray-900 border-r"
          >
            {{ index + 1 }}
          </td>
          <td
            class="break-all  text-m text-gray-900 font-light px-4 py-2 whitespace-normal border-r itbkk-title"
          >
            <button @click="handleViewTask(task)">{{ task.title }}</button>
          </td>
          <p
            v-if="task.assignees"
            class="break-all  text-m text-gray-900 font-light p-8 whitespace-normal border-r itbkk-assignees"
          >
            {{ task.assignees }}
          </p>
          <td v-else class="italic text-gray-500 font-light itbkk-assignees "
            >Unassigned</td
          >
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
          
          <td class=" px-4 py-2">
            <button
              class="text-purple-600 hover:text-purple-400 mb-2 mt-2 e-btn"
              @click="handleEditTask(task)"
            >
              Edit
            </button>
            <button
              class="text-red-600 hover:text-red-400  d-btn"
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
  </div>
</template>

<style scoped>
.d-btn {
  background-color: #a43434;
  border: none;
  color: white;
  padding: 10px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 12px;
}
.e-btn {
  background-color: #6b7380;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 12px;
}
.color-style {
  font-size: 1.3em;
}
border-r {
  border-right: 1px solid #f6f7f9;
}
.status {
  width: 120px;
}
</style>
