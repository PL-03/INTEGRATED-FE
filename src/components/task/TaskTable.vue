<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, watch, onMounted, onUpdated, computed } from "vue";
import { useToast, POSITION } from "vue-toastification";
import { getStatusText } from "@/libs/util";
import FilterDropdown from "./FilterDropdown.vue";
import ConfirmationModal from "../ConfirmationModal.vue";
import VueJwtDecode from "vue-jwt-decode";
import {
  isTokenExpired,
  getToken,
  decodedToken,
  removeTokens,
  useRefreshToken,
} from "@/services/tokenService";
import ModalPublicPrivate from "../ModalAlertToggle.vue";

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
  boardDetail: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "view-task",
  "edit-task",
  "add-task",
  "taskDeleted",
  "direction",
]);
const router = useRouter();
const route = useRoute();
const showConfirmationModal = ref(false);
const taskToDelete = ref(null);
const statusFiltered = ref([]);
const filteredTasks = ref([...props.tasks]);
const username = ref("");
const showDropdown = ref(false);
const isTokenValid = ref(true);
const boardId = route.params.boardId;
const boardName = ref("");
const boardVisible = ref("");
const showModal = ref(false);
const isToggled = ref(false);
const boardVisibility = ref("");
const currentId = ref("");
const board = ref({});

// const isPublic = ref(board.value.visibility === "PUBLIC");
const openModal = () => {
  showModal.value = true;
  // boardVisible.value = boardVisible.value === "Private" ? "Public" : "Private";
};

const isOwner = ref("");

const closeModal = () => {
  showModal.value = false;
};
const checkToggled = () => {
  if (boardVisibility.value === "PUBLIC") {
    return (isToggled.value = true);
  } else {
    return (isToggled.value = false);
  }
};
const confirmToggle = async () => {
  boardVisible.value = boardVisible.value === "PUBLIC" ? "PRIVATE" : "PUBLIC";
  showModal.value = false;

  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ visibility: boardVisible.value }),
      }
    );
    if (response.ok) {
      await fetchBoard();
      boardVisible.value = board.value.visibility;
      isToggled.value = boardVisible.value === "PUBLIC";
      showToast(
        "The board visibility has been successfully updated",
        "success"
      );
    } else if (response.status === 401) {
      localStorage.removeItem("jwtToken");
      router.push({ name: "login" });
    } else if (response.status === 403) {
      showToast(
        "You do not have permission to change the board visibility mode",
        "error"
      );
    } else {
      showToast("There is a problem. Please try again later.", "error");
    }
  } catch (error) {
    console.error(error);
  }
};

const statusColors = {
  "No Status": "#9ca3af",
  "To Do": "#ffd1d1",
  Doing: "#fde047",
  Done: "#5cd052",
};

const getStatusColor = (statusText) => {
  return statusColors[statusText] || "#D1FFFF"; // New color for new status
};

const fetchFilteredTasks = async () => {
  const selectedStatuses = statusFiltered.value.join(",");
  const url = `${import.meta.env.VITE_BASE_URL
    }/v3/boards/${boardId}/tasks?sortBy=statusV3.name&filterStatuses=${selectedStatuses}`;

  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    filteredTasks.value = data;
  } catch (error) {
    console.error("Error fetching filtered tasks:", error);
  }
};
const fetchBoard = async () => {
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
      board.value = data;
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
// const decodedToken = () => {
//   const token = localStorage.getItem("jwtToken");
//   if (!token || isTokenExpired(token)) {
//     isTokenValid.value = false;
//     localStorage.removeItem("jwtToken");
//     alert("Your session has expired. Please login again.");
//     router.push({ name: "login" });
//     return;
//   } else if (token) {
//     const decodedToken = VueJwtDecode.decode(token);
//     username.value = decodedToken.name;
//     currentId.value = decodedToken.oid;
//     console.log("Username is: ", username.value);
//   }
// };
const tokenDecoded = ref({});

const logout = () => {
  removeTokens();
  router.push({ name: "login" });
};

onMounted(async () => {
  await fetchBoard();
  tokenDecoded.value = decodedToken();
  username.value = tokenDecoded.value.name;
  currentId.value = tokenDecoded.value.oid;

  // boardVisibility.value = props.boardDetail.visibility;
  // boardVisible.value = props.boardDetail.visibility;
  isOwner.value = board.value.owner.oid === currentId.value;
  console.log(isOwner.value);
});
onUpdated(() => {
  boardName.value = props.boardDetail.name;
  boardVisibility.value = board.value.visibility;
  boardVisible.value = board.value.visibility;

  checkToggled();
});
watch(
  () => props.tasks,
  () => {
    filteredTasks.value = props.tasks.filter(
      (task) =>
        statusFiltered.value.length === 0 ||
        statusFiltered.value.includes(task.status.name)
    );
  },
  { immediate: true }
);

watch(statusFiltered, fetchFilteredTasks, fetchBoard, { immediate: true });

const handleSortData = (direction) => {
  if (!filteredTasks.value || filteredTasks.value.length === 0) return;

  const sortedTasks = [...filteredTasks.value];

  if (direction === "Def") {
    sortedTasks.sort((a, b) => a.id - b.id);
  } else {
    sortedTasks.sort((a, b) => {
      const statusA = getStatusText(a.status).toUpperCase();
      const statusB = getStatusText(b.status).toUpperCase();

      if (statusA < statusB) {
        return direction === "Asc" ? -1 : 1;
      }
      if (statusA > statusB) {
        return direction === "Asc" ? 1 : -1;
      }
      return 0;
    });
  }

  filteredTasks.value = sortedTasks;
};

const handleStatusList = () => {
  router.push({ name: "statusList" });
};

const handleAddTask = () => {
  router.push({ name: "taskadd" });
  emit("add-task");
};

const handleViewTask = (task) => {
  emit("view-task", task);
};

const handleEditTask = (task) => {
  router.push({ name: "taskedit", params: { taskId: task.id } });
  emit("edit-task", task.id);
};

const handleDeleteTask = (task) => {
  taskToDelete.value = task;
  showConfirmationModal.value = true;
};

const handleFilterData = (selectedOptions) => {
  statusFiltered.value = selectedOptions;
  fetchFilteredTasks();
};

const confirmDeleteTask = async () => {
  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/tasks/${taskToDelete.value.id
      }`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      showToast(
        `The task "${taskToDelete.value.title}" has been successfully deleted`,
        "success-delete"
      );
      emit("taskDeleted");
      fetchFilteredTasks();
    } else if (response.status === 404) {
      showToast("An error has occurred, the task does not exist", "error");
    } else {
      showToast("An error occurred while deleting the task", "error");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    showToast("An error occurred while deleting the task", "error");
  } finally {
    showConfirmationModal.value = false;
    taskToDelete.value = null;
  }
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
  taskToDelete.value = null;
};
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};
const showToast = (message, type) => {
  const toast = useToast();

  switch (type) {
    case "success-add":
    case "success-update":
    case "success-delete":
      toast.success(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      });
      break;
    case "error":
      toast.error(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      });
      break;
    default:
      toast(message);
  }
};
</script>
<template>
  <div class="bg-[#dfe0e2] min-h-screen font-lilita">
    <nav class="navbar h-20 flex justify-between z-10 shadow-md shadow-[#95999ad8]">
      <div class="image flex h-14 m-2">
        <img class="ml-4" src="https://www.sit.kmutt.ac.th/wp-content/uploads/2016/12/logo-kmutt.png" />
        <h1 class="text-start font-lilita p-4 text-black tracking-wide text-nowrap  text-base md:text-2xl">
          IT-Bangmod Kradan Kanban
        </h1>
      </div>

      <div class="flex m-4 items-center space-x-6">
        <button @click="handleAddTask"
          class="addBtn itbkk-button-add flex text-nowrap  text-xs md:text-base items-center text-md text-black hover:text-blue-600 transition duration-300"
          :disabled="!isOwner">
          Add Task
        </button>

        <button @click="handleStatusList"
          class="itbkk-manage-status flex text-nowrap  text-xs md:text-base items-centerd text-black hover:text-blue-600 transition duration-300">
          Manage Status
        </button>

        <div class="relative text-black">
          <button @click="toggleDropdown"
            class="itbkk-fullname text-nowrap  text-xs md:text-base flex items-center hover:text-[#4d5fcb]">
            <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6m0 14c-2.03 0-4.43-.82-6.14-2.88a9.95 9.95 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20" />
            </svg>
            {{ username }}
            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <div v-if="showDropdown" class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2">
            <ul>
              <li>
                <button @click="logout" class="itbkk-sign-out flex flex-row text-center px-4 py-2 hover:text-[#ba493f]">
                  <img src="/public/SignOut.png" width="22" height="10" class="mr-2 mt-1" />
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex justify-center">
      <div class="mt-14 w-fit">

        <div class="mb-14 text-3xl drop-shadow-lg">
          <span class="itbkk-board-name text-[#2b4483]">{{ boardName }}</span>
        </div>
        <div class="flex items-center justify-between my-2">

          <FilterDropdown @filter="handleFilterData" />

          <label class="visibilityBtn itbkk-board-visibility relative flex items-center cursor-pointer"
            :disabled="!isOwner">
            <input type="checkbox" value="" class="itbkk-board-visibility sr-only peer" v-model="isToggled"
              @change="openModal" />
            <div
              class="itbkk-board-visibility w-11 h-6 bg-gray-400 border border-[#535459] peer-focus:outline-none peer-focus:ring-2 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
            </div>
            <span class="ml-2 text-sm font-medium text-[#878a9c]">
              {{ isToggled ? "Public" : "Private" }}
            </span>
          </label>
        </div>
        <ModalPublicPrivate v-if="showModal" :show="showModal" :boardVisible="boardVisible" @confirm="confirmToggle"
          @close="closeModal" />
        <div class="flex justify-center items-center">
          <table class="table-auto mb-2 rounded-md overflow-hidden">
            <thead class="bg-yellow-950 border-b text-white tracking-wider">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Assignees</th>
                <th>
                  <div class="itbkk-status-sort rounded-md flex justify-center items-center px-1 py-1">
                    Status
                    <button class="ml-1 px-1 py-1 text-[#fff6a4] hover:text-[#a7e4f2] focus:text-[#a7e4f2]"
                      @click="handleSortData('Asc')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                        <path fill="currentColor"
                          d="M19.707 14.707A1 1 0 0 0 19 13h-7v2h4.586l-4.293 4.293A1 1 0 0 0 13 21h7v-2h-4.586zM7 3.99H5v12H2l4 4l4-4H7zM17 3h-2c-.417 0-.79.259-.937.649l-2.75 7.333h2.137L14.193 9h3.613l.743 1.981h2.137l-2.75-7.333A1 1 0 0 0 17 3m-2.057 4l.75-2h.613l.75 2z" />
                      </svg>
                    </button>
                    <button class="ml-1 px-1 py-1 text-[#fff6a4] hover:text-[#a7e4f2] focus:text-[#a7e4f2]"
                      @click="handleSortData('Desc')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                        <path fill="currentColor"
                          d="M19.707 14.707A1 1 0 0 0 19 13h-7v2h4.586l-4.293 4.293A1 1 0 0 0 13 21h7v-2h-4.586zM6 3.99l-4 4h3v12h2v-12h3zM17 3h-2c-.417 0-.79.259-.937.649l-2.75 7.333h2.137L14.193 9h3.613l.743 1.981h2.137l-2.75-7.333A1 1 0 0 0 17 3m-2.057 4l.75-2h.613l.75 2z" />
                      </svg>
                    </button>
                    <button class="ml-1 mr-1 px-2 text-[#fff6a4] hover:text-[#a7e4f2] focus:text-[#a7e4f2]"
                      @click="handleSortData('Def')">
                      Default
                    </button>
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(task, index) in filteredTasks" :key="index"
                :class="index % 2 === 0 ? 'bg-yellow-50' : 'bg-orange-100'"
                class="itbkk-item text-center border font-lilita h-14">
                <td class="px-4 border whitespace-nowrap font-medium text-gray-900">
                  {{ index + 1 }}
                </td>
                <td class="itbkk-title px-4 w-[15rem] break-all text-gray-900 font-light whitespace-normal border">
                  <button class="itbkk-title" @click="handleViewTask(task)">
                    {{ task.title }}
                  </button>
                </td>
                <td v-if="task.assignees"
                  class="break-all px-4 border whitespace-nowrap font-medium text-gray-900 itbkk-assignees">
                  {{ task.assignees }}
                </td>
                <td v-else class="px-4 italic text-gray-500 font-light border itbkk-assignees">
                  Unassigned
                </td>
                <td class="text-gray-900 font-light border whitespace-normal itbkk-status">
                  <button class="itbkk-status rounded px-4 status-text itbkk-status" :style="{
                    background: getStatusColor(getStatusText(task.status)),
                  }" style="word-break: break-word">
                    {{ getStatusText(task.status) }}
                  </button>
                </td>
                <td class="px-4">
                  <button class="editBtn text-blue-800 hover:text-blue-500 ml-2 e-btn itbkk-button-edit"
                    @click="handleEditTask(task)" :disabled="!isOwner">
                    <svg class="itbkk-button-edit" name="Edit" xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                      viewBox="0 0 576 512">
                      <path fill="currentColor"
                        d="m402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0m162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2M384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5" />
                    </svg>
                  </button>
                  <button class="deleteBtn text-red-700 hover:text-red-400 d-btn px-4" @click="handleDeleteTask(task)"
                    :disabled="!isOwner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
                      <path fill="currentColor" d="m6 2l2-2h4l2 2h4v2H2V2zM3 6h14l-1 14H4zm5 2v10h1V8zm3 0v10h1V8z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="h-16"></div>
      </div>
    </div>
  </div>
  <ConfirmationModal :show="showConfirmationModal" :taskTitle="taskToDelete?.title" @close="closeConfirmationModal"
    @confirm="confirmDeleteTask" />
</template>

<style scoped>
.navbar {
  background: linear-gradient(135deg,
      rgb(252, 255, 219) 20%,
      rgb(152, 217, 255) 40%,
      rgb(255, 221, 216) 100%);
}

.color-style {
  font-size: 1.3em;
}

border-r {
  border-right: 1px solid #f2f4f7;
}

.status {
  width: 120px;
}

.addBtn:disabled,
.editBtn:disabled,
.deleteBtn:disabled {
  color: #665f5f;
  cursor: not-allowed;
}

.visibilityBtn:disabled {
  cursor: not-allowed;
}

.table-auto thead th {
  width: 150px;
  /* ขนาดคงที่ของคอลัมน์หัวข้อ */
  min-width: 150px;
  text-align: center;
}

.table-auto thead .itbkk-status-sort {
  width: 200px;
  /* ขนาดคงที่สำหรับ Status */
}

.table-auto tbody td {
  min-width: 150px;
  /* ขนาดคงที่สำหรับตัวเนื้อหา */
}
</style>
