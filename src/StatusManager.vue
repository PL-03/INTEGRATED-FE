<script setup>
import { ref, onMounted, watch, computed } from "vue"
import StatusTable from "./components/stautus/StatusTable.vue"
import { useRoute, useRouter } from "vue-router"
import AddEditStatus from "./components/stautus/AddEditStatus.vue"
import PopupStatusModal from "./components/stautus/PopupStatusModal.vue"

const route = useRoute()
const router = useRouter()
const selectedStatus = ref({})
const stautsId = computed(() => route.params.statusId || null)
const isAddMode = computed(() => route.name === "statusadd")
const isEditMode = computed(() => route.name === "statusedit")
const isViewMode = computed(() => route.name === "statusview")
const showModal = ref(false)
const statuses = ref([])
const fetchStatus = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v2/statuses`)
    const data = await response.json()
    statuses.value = data
  } catch (error) {
    console.error("Error fetching statuses:", error)
  }
}
const fetchStatusDetails = async (id) => {
  if (id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/v2/statuses/${id}`
      )
      if (response.ok) {
        const data = await response.json()
        selectedStatus.value = data
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
    selectedStatus.value = {}
  }
}
onMounted(async () => {
  await fetchStatus()
  fetchStatusDetails(stautsId.value)
})
watch(
  stautsId,
  (newStatusId) => {
    fetchStatusDetails(newStatusId)
  },
  { immediate: true }
)
</script>

<template>
  <PopupStatusModal v-if="isViewMode" :selectedStatusId="selectedStatus" />
  <StatusTable
    :statuses="statuses"
    @add-status="showModal = true"
    @view-status="
      (status) => {
        selectedStatus = status
        router.push(`/status/manage/${status.id}`)
      }
    "
  />
  <AddEditStatus
    v-if="isAddMode || isEditMode"
    :statuses="statuses"
    :show="showModal"
    :task="isEditMode ? selectedStatus : {}"
    @update:show="showModal = $event"
    @status-added="fetchStatus"
    @status-updated="fetchStatus"
  />
</template>