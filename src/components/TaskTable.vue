<script setup>
import { useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import { useToast, POSITION } from "vue-toastification";
import { getStatusText } from "@/libs/util";
import FilterDropdown from "./FilterDropdown.vue";
import ConfirmationModal from "./ConfirmationModal.vue";
const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const handleSortData = (direction) => {
  if (direction === "Def") {
    return filteredTasks.value.sort((a, b) => a.id - b.id);
  }

  filteredTasks.value.sort((a, b) => {
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
};
const emit = defineEmits([
  "viewTask",
  "edit-task",
  "add-task",
  "taskDeleted",
  "direction",
]);
const router = useRouter();
const showConfirmationModal = ref(false);
const taskToDelete = ref(null);
const defaultStatuses = ["No Status", "To Do", "Doing", "Done"];
const statusFiltered = ref([]);
const filteredTasks = ref([]);

const statusColors = {
  "No Status": "#9ca3af",
  "To Do": "#ffd1d1",
  Doing: "#fde047",
  Done: "#5cd052",
};

const getStatusColor = (statusText) => {
  if (defaultStatuses.includes(statusText)) {
    return statusColors[statusText];
  } else {
    return "#D1FFFF"; // New color for new status
  }
};
const fetchFilteredTasks = async () => {
  const selectedStatuses = statusFiltered.value.join(",");
  const url = `${
    import.meta.env.VITE_BASE_URL
  }/v2/tasks?sortBy=status.name&filterStatuses=${selectedStatuses}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    filteredTasks.value = data;
  } catch (error) {
    console.error("Error fetching filtered tasks:", error);
  }
};
watch(statusFiltered, fetchFilteredTasks, { immediate: true });
// const filteredItems = computed(() => {
//   let items = props.sortableTasks;
//   if (statusFiltered.value.length) {
//     items = items.filter((item) => statusFiltered.value.includes(item.status));
//   }
//   return items;
//   // return props.sortableTasks.filter((item) => item.status === "To Do")
// });
const handleStatusList = () => {
  router.push({ name: "statusList" });
};

const handleAddTask = () => {
  router.push({ name: "taskadd" });
  emit("add-task"); // Emit add-task event
};

const handleViewTask = (task) => {
  emit("viewTask", task);
};

const handleEditTask = (task) => {
  router.push({ name: "taskedit", params: { taskId: task.id } });
  emit("edit-task", task.id); // Emit edit-task event with task ID
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
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v2/tasks/${taskToDelete.value.id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      showToast(
        `The task "${taskToDelete.value.title}" has been successfully deleted`,
        "success-delete"
      );
      emit("taskDeleted"); // Emit the "taskDeleted" event without the task ID
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

const showToast = (message, type) => {
  const toast = useToast(); // Create a toast instance

  switch (type) {
    case "success-add":
      toast.success(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      });
      break;
    case "success-update":
      toast.success(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      });
      break;
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
  <div class="bg-gradient-to-t from-gray-500 to-blue-100 min-h-screen">
    <div
      class="h-20 flex justify-between shadow-md bg-blue-950 fixed top-0 left-0 right-0 min-w-screen"
    >
      <div class="image flex h-14 m-2">
        <img
          class="mt-2 ml-8"
          src="https://www.sit.kmutt.ac.th/wp-content/uploads/2016/12/logo-flat-blk-55.png"
        />
        <img
          class="ml-4"
          src="https://www.sit.kmutt.ac.th/wp-content/uploads/2016/12/logo-kmutt.png"
        />

        <h1 class="text-start text-2xl font-serif font-bold p-4 text-white">
          IT-Bangmod Kradan Kanban
        </h1>
      </div>

      <div class="flex m-4">
        <button
          class="flex text-sm px-3 py-1 mt-4 bg-green-500 hover:bg-emerald-500 text-white font-bold rounded itbkk-button-add"
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

        <button
          class="flex text-sm px-3 py-1 mt-4 ml-2 bg-blue-700 hover:bg-sky-500 text-white font-bold rounded itbkk-manage-status"
          @click="handleStatusList"
        >
          <svg
            class="mr-1"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="22"
            viewBox="0 0 2048 2048"
          >
            <path
              fill="currentColor"
              d="M768 1024q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-117 35-229t101-207t157-169t203-113q-56-36-100-83t-76-103t-47-118t-17-130q0-106 40-199t109-163T568 40T768 0t199 40t163 109t110 163t40 200q0 67-16 129t-48 119t-75 103t-101 83q69 26 132 64t117 89l-87 95q-89-82-201-126t-233-44M384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149m1530 1027q6 30 6 61t-6 61l124 51l-49 119l-124-52q-35 51-86 86l52 124l-119 49l-51-124q-30 6-61 6t-61-6l-51 124l-119-49l52-124q-51-35-86-86l-124 52l-49-119l124-51q-6-30-6-61t6-61l-124-51l49-119l124 52q35-51 86-86l-52-124l119-49l51 124q30-6 61-6t61 6l51-124l119 49l-52 124q51 35 86 86l124-52l49 119zm-314 253q40 0 75-15t61-41t41-61t15-75t-15-75t-41-61t-61-41t-75-15t-75 15t-61 41t-41 61t-15 75t15 75t41 61t61 41t75 15"
            />
          </svg>
          Manage Status
        </button>
      </div>
    </div>

    <div class="h-32"></div>
    <FilterDropdown :tasks="tasks" @filter="handleFilterData" />
    <div class="flex justify-center items-center">
      <table class="table-auto w-9/12 m-2 rounded-2xl overflow-hidden">
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
              Title
            </th>
            <th
              class="text-lg font-medium text-white px-4 py-2 text-left border-r"
            >
              Assignees
            </th>
            <th
              class="text-lg font-medium text-white px-4 py-2 text-left border-r"
            >
              Status<br />
              <button
                class="border border-black bg-white text-yellow-950 hover:bg-yellow-950 hover:text-white"
                @click="handleSortData('Asc')"
              >
                Asc
              </button>
              <button
                class="ml-2 border border-black bg-white text-yellow-950 hover:bg-yellow-950 hover:text-white"
                @click="handleSortData('Desc')"
              >
                Desc
              </button>
              <button
                class="ml-2 border border-black bg-white text-yellow-950 hover:bg-yellow-950 hover:text-white"
                @click="handleSortData('Def')"
              >
                Default
              </button>
            </th>
            <th class="text-lg font-medium text-white px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(task, index) in filteredTasks"
            :key="index"
            :class="index % 2 === 0 ? 'bg-yellow-50' : 'bg-orange-100'"
            class="font-mono text-center border itbkk-item"
          >
            <td
              class="px-4 py-2 border whitespace-nowrap text-m font-medium text-gray-900 border-r"
            >
              {{ index + 1 }}
            </td>
            <td
              class="break-all text-m text-gray-900 font-light whitespace-normal border itbkk-title"
            >
              <button @click="handleViewTask(task)">{{ task.title }}</button>
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
              class="text-m text-gray-900 font-light px-4 py-2 border whitespace-normal itbkk-status"
            >
              <button
                class="status font-bold py-2 px-4 rounded status-text itbkk-status"
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="h-16"></div>
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
