<script setup>
import { ref, onMounted, watch, computed } from "vue";
import TaskTable from "./components/task/TaskTable.vue";
import PopupModal from "./components/task/PopupModal.vue";
import AddEditModal from "./components/AddEditModal.vue";

import { useRoute, useRouter } from "vue-router";
import {
  isTokenExpired,
  getToken,
  useRefreshToken,
} from "./services/tokenService";

const tasks = ref([]);
const selectedTask = ref({});
const route = useRoute();
const router = useRouter();
const taskId = computed(() => route.params.taskId || null);
const isAddMode = computed(() => route.name === "taskadd");
const isEditMode = computed(() => route.name === "taskedit");
const isViewMode = computed(() => route.name === "taskdetail");
const showModal = ref(false);
const statuses = ref([]);
const boardId = route.params.boardId;
const boardDetail = ref({});

const fetchBoardsById = async () => {
  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      boardDetail.value = data;
    } else if (response.status === 404) {
      alert("The requested board does not exist");
      router.push({ name: "boardslist" });
    } else if (response.status === 401) {
      localStorage.removeItem("jwtToken");
      router.push({ name: "login" });
    } else if (response.status === 403) {
      router.push({ name: "denial" });
    }
  } catch (error) {
    console.error("Error fetching boards:", error);
  }
};
const fetchTasks = async () => {
  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      tasks.value = data;
    } else if (response.status === 401) {
      localStorage.removeItem("jwtToken");
      router.push({ name: "login" });
    } else if (response.status === 403) {
      router.push({ name: "denial" });
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

const fetchTaskDetails = async (id) => {
  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  if (id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        selectedTask.value = data;
      } else if (response.status === 404) {
        alert("The requested task does not exist");
        router.push({ name: "tasklist" });
      } else {
        console.error("Error fetching task details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  } else {
    selectedTask.value = {};
  }
};

const fetchStatuses = async () => {
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
    const data = await response.json();
    if (response.ok) {
      statuses.value = data;
    } else if (response.status === 401) {
      localStorage.removeItem("jwtToken");
      router.push({ name: "login" });
    } else if (response.status === 403) {
      router.push({ name: "denial" });
    }
  } catch (error) {
    console.error("Error fetching statuses:", error);
  }
};
onMounted(async () => {
  await fetchBoardsById();
  await fetchTasks();
  await fetchStatuses();
  fetchTaskDetails(taskId.value);
});

watch(
  taskId,
  (newTaskId) => {
    fetchTaskDetails(newTaskId);
  },
  { immediate: true }
);

const handleViewTask = (task) => {
  selectedTask.value = task;
  router.push({ name: "taskdetail", params: { taskId: task.id } });
};

const handleEditTask = (taskId) => {
  const task = tasks.value.find((t) => t.id === taskId);
  if (task) {
    selectedTask.value = { ...task };
    showModal.value = true;
  }
  console.log(showModal.value);
};

const handleAddTask = () => {
  showModal.value = true;
  selectedTask.value = {};
};
</script>

<template>
  <TaskTable
    :tasks="tasks"
    :boardDetail="boardDetail"
    @view-task="handleViewTask"
    @edit-task="handleEditTask"
    @add-task="handleAddTask"
    @task-deleted="fetchTasks"
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
