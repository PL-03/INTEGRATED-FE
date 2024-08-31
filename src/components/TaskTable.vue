<script setup>
import { useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";
import { useToast, POSITION } from "vue-toastification";
import { getStatusText } from "@/libs/util";
import FilterDropdown from "./FilterDropdown.vue";
import ConfirmationModal from "./ConfirmationModal.vue";
import VueJwtDecode from "vue-jwt-decode";
import { isTokenExpired } from "@/libs/util";

const props = defineProps({
  tasks: {
    type: Array,
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
const showConfirmationModal = ref(false);
const taskToDelete = ref(null);
const statusFiltered = ref([]);
const filteredTasks = ref([...props.tasks]);
const username = ref("");
const showDropdown = ref(false);
const isTokenValid = ref(true);

const statusColors = {
  "No Status": "#9ca3af",
  "To Do": "#ffd1d1",
  Doing: "#fde047",
  Done: "#5cd052",
};
const getToken = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token || isTokenExpired(token)) {
    isTokenValid.value = false;
    localStorage.removeItem("jwtToken");
    alert("Your session has expired. Please login again.");
    router.push({ name: "login" });
    return null;
  }
  return token;
};

const getStatusColor = (statusText) => {
  return statusColors[statusText] || "#D1FFFF"; // New color for new status
};

const fetchFilteredTasks = async () => {
  const selectedStatuses = statusFiltered.value.join(",");
  const url = `${
    import.meta.env.VITE_BASE_URL
  }/v2/tasks?sortBy=status.name&filterStatuses=${selectedStatuses}`;

  const token = getToken();
  if(!token) return;
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    filteredTasks.value = data;
  } catch (error) {
    console.error("Error fetching filtered tasks:", error);
  }
};
const decodedToken = () => {
  const token = localStorage.getItem("jwtToken");
  if(!token || isTokenExpired(token)){
    isTokenValid.value = false
    localStorage.removeItem("jwtToken");
    alert("Your session has expired. Please login again.");
    router.push({ name: "login" });
    return
  }
  else if (token) {
    const decodedToken = VueJwtDecode.decode(token);
    username.value = decodedToken.name;
    console.log("Username is: ", username.value);
  }
};
const logout = () => {
  localStorage.removeItem("jwtToken");
  router.push({ name: "login" });
};

onMounted(() => {
  decodedToken();
  console.log(isTokenValid.value);
  
  
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

watch(statusFiltered, fetchFilteredTasks, { immediate: true });

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
  if(!token) return;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v2/tasks/${taskToDelete.value.id}`,
      {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
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
  <!-- bg-gradient-to-t from-gray-500 to-blue-100 -->
  <div class="bg-[#3e3e44] min-h-screen font-lilita">
    <nav
      class="h-20 flex justify-between shadow-md bg-blue-950 fixed left-0 right-0 top-0 z-10 min-w-screen shadow-lg shadow-[#575766]"
    >
      <div class="image flex h-14 m-2">
        <!-- <img class="mt-2 ml-8" src="https://www.sit.kmutt.ac.th/wp-content/uploads/2016/12/logo-flat-blk-55.png" /> -->
        <img
          class="ml-4"
          src="https://www.sit.kmutt.ac.th/wp-content/uploads/2016/12/logo-kmutt.png"
        />

        <h1
          class="text-start text-wrap text-2xl font-lilita p-4 text-white tracking-wide"
        >
          IT-Bangmod Kradan Kanban
        </h1>
      </div>

      <div class="flex m-4">
        <!-- bg-green-500 hover:bg-emerald-500 -->
        <button
          class="flex text-sm px-3 py-1 mt-3 text-white hover:text-[#45e971] rounded itbkk-button-add"
          @click="handleAddTask"
        >
          <svg
            class="mr-1"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="22"
            viewBox="0 0 20 20"
          >
            <path
              fill="currentColor"
              d="M11 9V5H9v4H5v2h4v4h2v-4h4V9zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20"
            />
          </svg>
          Add Task
        </button>
        <p class="mt-3 mx-2 text-gray-500">|</p>

        <!-- bg-blue-700 hover:bg-sky-500 -->
        <button
          class="flex text-sm px-3 py-1 mt-3 ml-1 text-white hover:text-[#6fd4ff] rounded itbkk-manage-status"
          @click="handleStatusList"
        >
          <svg
            class="mr-1"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="22"
            viewBox="0 4 20 20"
          >
            <circle cx="10" cy="8" r="4" fill="currentColor" />
            <path
              fill="currentColor"
              d="M10.67 13.02c-.22-.01-.44-.02-.67-.02c-2.42 0-4.68.67-6.61 1.82c-.88.52-1.39 1.5-1.39 2.53V20h9.26a6.96 6.96
               0 0 1-.59-6.98M20.75 16c0-.22-.03-.42-.06-.63l1.14-1.01l-1-1.73l-1.45.49q-.48-.405-1.08-.63L18 11h-2l-.3 
               1.49q-.6.225-1.08.63l-1.45-.49l-1 1.73l1.14 1.01c-.03.21-.06.41-.06.63s.03.42.06.63l-1.14 1.01l1 1.73l1.45-.49q.48.405 
               1.08.63L16 21h2l.3-1.49q.6-.225 1.08-.63l1.45.49l1-1.73l-1.14-1.01c.03-.21.06-.41.06-.63M17 18c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2"
            />
          </svg>
          Manage Status
        </button>
        <p class="mt-3 mx-2 text-gray-500">|</p>
        <p class="mx-2 text-sm text-[#fffcb3] ]" @click="handleLoginPage">
          <svg
            class="ml-4"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6m0 14c-2.03 0-4.43-.82-6.14-2.88a9.95 9.95 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20"
            />
          </svg>
          <button @click="toggleDropdown" class="itbkk-fullname">
            {{ username }}
          </button>
          <div v-if="showDropdown">
            <ul>
              <li><button @click="logout">Logout</button></li>
            </ul>
          </div>
        </p>
      </div>
    </nav>

    <div class="p-28">
      <div>
        <FilterDropdown @filter="handleFilterData" />
      </div>

      <div class="flex justify-center items-center">
        <table class="table-auto w-10/12 m-2 rounded-2xl overflow-hidden">
          <thead class="bg-yellow-950 border-b text-white ml-8 tracking-wider">
            <!-- <tr class="text-lg font-medium text-white px-4 py-2 text-left border-r "> -->
            <th>#</th>
            <th>Title</th>
            <th>Assignees</th>
            <th>
              <div
                class="itbkk-status-sort rounded-md flex justify-center items-center px-1 py-1"
              >
                Status

                <button
                  class="ml-1 px-1 py-1 text-[#fff6a4] hover:text-[#a7e4f2] focus:text-[#a7e4f2]"
                  @click="handleSortData('Asc')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M19.707 14.707A1 1 0 0 0 19 13h-7v2h4.586l-4.293 4.293A1 1 0 0 0 13 21h7v-2h-4.586zM7 3.99H5v12H2l4 4l4-4H7zM17 3h-2c-.417 0-.79.259-.937.649l-2.75 7.333h2.137L14.193 9h3.613l.743 1.981h2.137l-2.75-7.333A1 1 0 0 0 17 3m-2.057 4l.75-2h.613l.75 2z"
                    />
                  </svg>
                </button>
                <button
                  class="ml-1 px-1 py-1 text-[#fff6a4] hover:text-[#a7e4f2] focus:text-[#a7e4f2]"
                  @click="handleSortData('Desc')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M19.707 14.707A1 1 0 0 0 19 13h-7v2h4.586l-4.293 4.293A1 1 0 0 0 13 21h7v-2h-4.586zM6 3.99l-4 4h3v12h2v-12h3zM17 3h-2c-.417 0-.79.259-.937.649l-2.75 7.333h2.137L14.193 9h3.613l.743 1.981h2.137l-2.75-7.333A1 1 0 0 0 17 3m-2.057 4l.75-2h.613l.75 2z"
                    />
                  </svg>
                </button>
                <button
                  class="ml-1 mr-1 px-2 text-[#fff6a4] hover:text-[#a7e4f2] focus:text-[#a7e4f2]"
                  @click="handleSortData('Def')"
                >
                  Default
                </button>
              </div>
            </th>
            <th>Actions</th>
            <!-- </tr> -->
          </thead>
          <tbody
            v-for="(task, index) in filteredTasks"
            :key="index"
            :class="index % 2 === 0 ? 'bg-yellow-50' : 'bg-orange-100'"
            class="text-center border itbkk-item font-lilita"
          >
            <td
              class="px-4 py-2 border whitespace-nowrap text-m font-medium text-gray-900 border-r"
            >
              {{ index + 1 }}
            </td>
            <td
              class="itbkk-title break-all text-m text-gray-900 font-light whitespace-normal border"
            >
              <button class="itbkk-title" @click="handleViewTask(task)">
                {{ task.title }}
              </button>
            </td>
            <p
              v-if="task.assignees"
              class="break-all text-m text-gray-900 font-light py-11 px-2 whitespace-normal itbkk-assignees"
            >
              {{ task.assignees }}
            </p>
            <td
              v-else
              class="italic text-gray-500 font-light border itbkk-assignees"
            >
              Unassigned
            </td>

            <td
              class="text-m text-gray-900 font-light border whitespace-normal itbkk-status"
            >
              <button
                class="itbkk-status py-2 px-4 rounded status-text itbkk-status"
                :style="{
                  background: getStatusColor(getStatusText(task.status)),
                }"
                style="word-break: break-word"
              >
                {{ getStatusText(task.status) }}
              </button>
            </td>

            <td class="flex justify-center px-4 py-2">
              <!-- //edit -->
              <button
                class="text-blue-800 hover:text-blue-500 mt-3 ml-2 e-btn itbkk-button-edit"
                @click="handleEditTask(task)"
              >
                <svg
                  class="itbkk-button-edit"
                  name="Edit"
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

              <!-- //delete -->
              <button
                class="text-red-700 hover:text-red-400 mt-2 d-btn px-4 py-8"
                @click="handleDeleteTask(task)"
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
            <!-- </tr> -->
          </tbody>
        </table>
      </div>
      <div class="h-16"></div>
    </div>
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
  border-right: 1px solid #f2f4f7;
}

.status {
  width: 120px;
}
</style>
