<script setup>
import { ref, onMounted, watch, computed } from "vue"
import StatusTable from "./components/stautus/StatusTable.vue"
import { useRoute, useRouter } from "vue-router"
import AddEditStatus from "./components/stautus/AddEditStatus.vue"
import PopupStatusModal from "./components/stautus/PopupStatusModal.vue"

const route = useRoute()
const router = useRouter()
const selectedStatus = ref({})
const stautsId = computed(() => route.params.id || null)
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
const fetchStatusDetails = async (statusId) => {
  if (statusId) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/v2/statuses/${statusId}`
      )
      if (response.ok) {
        const data = await response.json()
        selectedStatus.value = data
      } else if (response.status === 404) {
        alert("The requested status does not exist")
        router.push("/status")
      } else {
        console.error("Error fetching status details:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching status details:", error)
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
const handleEditStatus = (statusId) => {
  const status = statuses.value.find((s) => s.statusId === statusId)
  if (status) {
    selectedStatus.value = { ...status }
    showModal.value = true
  }
}
const handleAddStatus = () => {
  showModal.value = true
  selectedStatus.value = {}
}
</script>

<template>
  <PopupStatusModal v-if="isViewMode" :selectedStatusId="selectedStatus" />
  <StatusTable
    :statuses="statuses"
    @add-status="handleAddStatus"
    @edit-status="handleEditStatus"
    @status-deleted="fetchStatus"
  />
  <AddEditStatus
    v-if="isAddMode || isEditMode"
    :show="showModal"
    :statuses="isEditMode ? selectedStatus : {}"
    @update:show="showModal = $event"
    @status-added="fetchStatus"
    @status-updated="fetchStatus"
  />
</template>
