<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useToast, POSITION } from "vue-toastification"
import ConfirmationModal from "../ConfirmationModal.vue"

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
  router.push({ name: "statusadd" })
  emit("add-status") // Emit add-status event
}

const handleEditStatus = (status) => {
  router.push(`/status/manage/${status.id}/edit`)
  emit("edit-status", status.id)
  console.log(status.id)
}
const handleViewTask = (status) => {
  console.log(status)
  emit("view-status", status)
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
  <div
    class="Status-content bg-gradient-to-t from-gray-700 to-blue-100 min-h-screen"
  >
    <div>
      <h1 class="text-5xl font-bold p-8">IT-Bangmod Kradan Kanban</h1>
    </div>
    <div class="mt-2 grid grid-cols-2 items-center">
      <div class="flex justify-start">
        <button
          @click="closeStatusPage"
          class="ml-48 mt-2 font-bold p-2 rounded itbkk-button-home"
        >
          <strong class="text-blue-700">Home</strong>
        </button>
        <strong class="text-gray-500 mt-4 ml-2"> &gt; </strong>
        <strong class="text-black mt-4 ml-4">Task Status</strong>
      </div>
      <div class="flex justify-end">
        <button
          class="flex mr-48 mt-2 bg-green-500 hover:bg-emerald-500 text-white font-bold p-2 rounded itbkk-button-add"
          @click="handleAddStatus"
        >
          <svg
            class="mr-1"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="24"
            viewBox="0 0 20 20"
          >
            <path
              fill="currentColor"
              d="M11 9V5H9v4H5v2h4v4h2v-4h4V9zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20"
            />
          </svg>
          Add Task
        </button>
      </div>
    </div>
    <div class="mt-4 flex justify-center items-center">
      <table
        class="table-auto w-9/12 m-2 rounded-2xl overflow-hidden shadow-md shadow-white/40"
      >
        <thead class="bg-yellow-950 border-b py-4 text-white">
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
            :class="index % 2 === 0 ? 'bg-yellow-50' : 'bg-orange-100'"
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
              <button @click="handleViewTask(status)">{{ status.name }}</button>
            </td>
            <td
              class="text-m text-gray-900 font-light px-4 py-2 whitespace-normal border-r itbkk-status-description"
            >
              {{ status.description || "No description provided" }}
            </td>
            <td class="px-4 py-2">
              <button
                class="text-blue-800 hover:text-blue-500 mb-2 e-btn"
                @click="handleEditStatus(status)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 576 512"
                >
                  <path
                    fill="currentColor"
                    d="m402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0m162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2M384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5"
                  />
                </svg>
              </button>
              <button
                class="text-red-700 hover:text-red-400 d-btn px-4"
                @click="handleDeleteStatus(status)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="currentColor"
                    d="m6 2l2-2h4l2 2h4v2H2V2zM3 6h14l-1 14H4zm5 2v10h1V8zm3 0v10h1V8z"
                  />
                </svg>
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
