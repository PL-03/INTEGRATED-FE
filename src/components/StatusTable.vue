<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import ConfirmationModal from "./ConfirmationModal.vue"

const emit = defineEmits(["statusDeleted"])
const router = useRouter()
const statuses = ref([])
const showConfirmationModal = ref(false)
const statusToDelete = ref(null)

const fetchStatuses = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v2/statuses`)
    const data = await response.json()
    statuses.value = data
  } catch (error) {
    console.error("Error fetching statuses:", error)
  }
}

const closeStatusPage = () => {
  router.push("/task")
}

const handleAddStatus = () => {
  // Implement the logic for adding a new status
}

const handleEditStatus = (status) => {
  // Implement the logic for editing a status
}

const handleDeleteStatus = (status) => {
  statusToDelete.value = status
  showConfirmationModal.value = true
}

const confirmDeleteStatus = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v2/statuses/${
        statusToDelete.value.statusId
      }`,
      {
        method: "DELETE",
      }
    )

    if (response.ok) {
      showToast("The status has been deleted", "success")
      emit("statusDeleted")
    } else {
      showToast("An error occurred while deleting the status", "error")
    }
  } catch (error) {
    console.error("Error deleting status:", error)
    showToast("An error occurred while deleting the status", "error")
  } finally {
    showConfirmationModal.value = false
    statusToDelete.value = null
  }
}

const closeConfirmationModal = () => {
  showConfirmationModal.value = false
  statusToDelete.value = null
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

onMounted(async () => {
  await fetchStatuses()
})
</script>

<template>
  <div class="Status-content">
    <div>
      <h1 class="text-5xl font-bold p-8">IT-Bangmod Kradan Kanban</h1>
    </div>
    <div class="mt-2 grid grid-cols-2 items-center">
      <div class="flex justify-start">
        <button
          @click="closeStatusPage"
          class="ml-48 mt-2 font-bold p-2 rounded itbkk-button-home"
        >
          <strong class="text-blue-600">Home</strong>
        </button>
        <strong class="text-gray-500 mt-4 ml-2"> &gt; </strong>
        <strong class="text-black mt-4 ml-4">Task Status</strong>
      </div>
      <div class="flex justify-end">
        <button
          class="mr-48 mt-2 bg-green-700 hover:bg-green-700 text-white font-bold p-2 rounded itbkk-button-add"
          @click="handleAddStatus"
        >
          Add status
        </button>
      </div>
    </div>
    <div class="mt-4 flex justify-center items-center">
      <table class="table-auto w-9/12 m-2 rounded-2xl overflow-hidden">
        <thead class="bg-blue-950 border-b py-4 text-white">
          <tr>
            <th
              class="text-lg font-medium text-white px-4 py-2 text-left border-r"
            >
              #
            </th>
            <th
              class="text-lg font-medium text-white px-4 py-2 text-left border-r"
            >
              Name
            </th>
            <th
              class="text-lg font-medium text-white px-4 py-2 text-left border-r"
            >
              Description
            </th>
            <th class="text-lg font-medium text-white px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(status, index) in statuses"
            :key="status.statusId"
            class="itbkk-item font-mono border-b"
          >
            <td
              class="px-4 py-2 whitespace-nowrap text-m font-medium text-gray-900 border-r"
            >
              {{ index + 1 }}
            </td>
            <td
              class="text-m text-gray-900 font-light px-4 py-2 whitespace-normal border-r itbkk-status-name"
            >
              {{ status.name }}
            </td>
            <td
              class="text-m text-gray-900 font-light px-4 py-2 whitespace-normal border-r itbkk-status-description"
            >
              {{ status.description || "No description provided" }}
            </td>
            <td class="px-4 py-2">
              <button
                class="text-purple-600 hover:text-purple-400 mb-2 mt-2 e-btn"
                @click="handleEditStatus(status)"
              >
                Edit
              </button>
              <button
                class="text-red-600 hover:text-red-400 d-btn"
                @click="handleDeleteStatus(status)"
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
      :statusName="statusToDelete?.name"
      @close="closeConfirmationModal"
      @confirm="confirmDeleteStatus"
    />
  </div>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
