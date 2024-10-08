<script setup>
import { ref, onMounted, watch, computed } from "vue";
import StatusTable from "./components/stautus/StatusTable.vue";
import { useRoute, useRouter } from "vue-router";
import AddEditStatus from "./components/stautus/AddEditStatus.vue";
import {
  getToken,
  handleTokenRefresh,
  useRefreshToken,
} from "./services/tokenService";

const route = useRoute();
const router = useRouter();
const selectedStatus = ref({});
const statusId = computed(() => route.params.id || null);
const isAddMode = computed(() => route.name === "statusadd");
const isEditMode = computed(() => route.name === "statusedit");
const showModal = ref(false);
const statuses = ref([]);
// const isTokenValid = ref(true);
const boardId = route.params.boardId;

const fetchStatus = async () => {
  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/statuses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    statuses.value = await response.json();
  } catch (error) {
    console.error("Error fetching statuses:", error);
  }
};

const fetchStatusDetails = async (statusId) => {
  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  if (statusId) {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/v3/boards/${boardId}/statuses/${statusId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        selectedStatus.value = data;
      } else if (response.status === 404) {
        alert("An error has occurred, the status does not exist");
        router.push({ name: "statusList" });
      } else {
        console.error("Error fetching status details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching status details:", error);
    }
  } else {
    selectedStatus.value = {};
  }
};

onMounted(async () => {
  await fetchStatus();
  fetchStatusDetails(statusId.value);
});

watch(
  statusId,
  (newStatusId) => {
    fetchStatusDetails(newStatusId);
  },
  { immediate: true }
);

const handleEditStatus = (status) => {
  selectedStatus.value = { ...status };
  showModal.value = true;
};

const handleAddStatus = () => {
  showModal.value = true;
  selectedStatus.value = {};
};
</script>

<template>
  <StatusTable
    :statuses="statuses"
    @add-status="handleAddStatus"
    @edit-status="handleEditStatus"
    @status-deleted="fetchStatus"
  />
  <AddEditStatus
    v-if="isAddMode || isEditMode"
    :show="showModal"
    :status="isEditMode ? selectedStatus : {}"
    :statuses="statuses"
    @update:show="showModal = $event"
    @status-added="fetchStatus"
    @status-updated="fetchStatus"
  />
</template>
