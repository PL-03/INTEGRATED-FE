<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast, POSITION } from "vue-toastification";
import ConfirmationModal from "../ConfirmationModal.vue";
import {
  getToken,
  decodedToken,
  useRefreshToken,
} from "@/services/tokenService";
const props = defineProps({
  statuses: {
    type: Array,
    required: true,
  },
});
const route = useRoute();
const emit = defineEmits(["add-status", "edit-status", "status-deleted"]);
const router = useRouter();
const showConfirmationModal = ref(false);
const statusToDelete = ref(null);
const defaultStatus = ["No Status", "Done"];
const showTransferModal = ref(false);
const board = ref({});
const currentId = ref("");
const boardId = route.params.boardId;
const isOwner = ref("");
const tokenDecoded = ref({});
const isWriteCollab = ref(false);
const isDisabled = ref(false);
const showDropdown = ref(false);
const username = ref("");

// const decodedToken = () => {
//   let token = getToken();
//   if (!token || isTokenExpired(token)) {
//     removeTokens();
//     router.push({ name: "login" });
//     return;
//   } else if (token) {
//     const decodedToken = VueJwtDecode.decode(token);
//     currentId.value = decodedToken.oid;
//   }
// };
const closeStatusPage = () => {
  router.push({ name: "tasklist" });
};

const handleAddStatus = () => {
  router.push({ name: "statusadd" });
  emit("add-status"); // Emit add-status event
};
// name: "statusedit"
const handleEditStatus = (status) => {
  router.push({ name: "statusedit", params: { id: status.id } });
  emit("edit-status", status.id);
};
const fetchBoard = async () => {
  let token = getToken();
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
      let token = getToken();
      if (!token) {
        await useRefreshToken();
        token = getToken();
      } else if (!token) {
        removeTokens();
        router.push({ name: "login" });
      }
    } else if (response.status === 403) {
      router.push({ name: "boardslist" });
    }
  } catch (error) {
    console.error("Error fetching boards:", error);
  }
};
onMounted(async () => {
  await fetchBoard();
  tokenDecoded.value = decodedToken();
  username.value = tokenDecoded.value.name;
  currentId.value = tokenDecoded.value.oid;
  isOwner.value = board.value.owner.oid === currentId.value;
  const matchCurrentUser = board.value.collaborators.find(
    (collaborator) => collaborator.oid === currentId.value
  );

  if (currentId.value === matchCurrentUser.oid) {
    if (matchCurrentUser.accessRight === "WRITE") {
      isWriteCollab.value = true;
    } else if (isOwner.value === false && isWriteCollab.value === false) {
      isDisabled.value = true;
    }
  }
});
const handleDeleteStatus = async (status) => {
  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  statusToDelete.value = status;
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/tasks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const tasks = await response.json();

  const associatedTasks = tasks.filter((task) => task.status === status.name);
  const hasAssociatedTasks = associatedTasks.length > 0;

  if (hasAssociatedTasks) {
    showTransferModal.value = true;
    statusToDelete.value.associatedTasksCount = associatedTasks.length;
  } else {
    showConfirmationModal.value = true;
  }
};

const confirmDeleteStatus = async () => {
  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    if (
      statusToDelete.value.name === "No Status" ||
      statusToDelete.value.name === "Done"
    ) {
      showToast(`The status can not be deleted`, "error");
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/statuses/${
        statusToDelete.value.id
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
      // Remove the deleted status from the statuses array
      props.statuses.splice(
        props.statuses.findIndex((s) => s.id === statusToDelete.value.id),
        1
      );
      emit("status-deleted");
      showToast(
        `The status "${statusToDelete.value.name}" has been successfully deleted`,
        "success-delete"
      );
    } else {
      console.error("Error deleting status:", response.statusText);
      showToast("An error occurred while deleting the status", "error");
    }
  } catch (error) {
    console.error("Error deleting status:", error);
    showToast("An error occurred while deleting the status", "error");
  } finally {
    showConfirmationModal.value = false;
    showTransferModal.value = false;
  }
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
};

const closeTransferModal = () => {
  showTransferModal.value = false;
};

const transferTasks = async (targetStatusId) => {
  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    if (
      statusToDelete.value.name === "No Status" ||
      statusToDelete.value.name === "Done"
    ) {
      showToast(`The status can not be deleted`, "error");
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/statuses/${
        statusToDelete.value.id
      }/${targetStatusId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      // Remove the deleted status from the statuses array
      props.statuses.splice(
        props.statuses.findIndex((s) => s.id === statusToDelete.value.id),
        1
      );
      emit("status-deleted");
      showToast(
        `The status "${statusToDelete.value.name}" has been successfully deleted and associated tasks transferred`,
        "success-delete"
      );
    } else {
      console.error(
        "Error deleting status and transferring tasks:",
        response.statusText
      );
      showToast(
        "An error occurred while deleting the status and transferring associated tasks",
        "error"
      );
    }
  } catch (error) {
    console.error("Error deleting status and transferring tasks:", error);
    showToast(
      "An error occurred while deleting the status and transferring associated tasks",
      "error"
    );
  } finally {
    showConfirmationModal.value = false;
    showTransferModal.value = false;
  }
};
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
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
        timeout: 5000,
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
  <!-- bg-gradient-to-t from-gray-600 to-blue-200/20 -->
  <div class="bg-[#dfe0e2] min-h-screen font-lilita">
    <nav
      class="navbar h-20 flex justify-between fixed left-0 right-0 top-0 z-10 shadow-md shadow-[#95999ad8]"
    >
      <!-- shadow-md bg-gradient-to-t from-blue-100 via-blue-300 to-blue-900 shadow-[#5d5d5fc7] bg-[#eaeef2]-->
      <div class="image flex h-14 m-2">
        <!-- <img
          class="ml-4"
          src="https://www.sit.kmutt.ac.th/wp-content/uploads/2016/12/logo-kmutt.png"
        /> -->
        <h1
          class="text-start text-2xl font-lilita p-4 text-black tracking-wide"
        >
          IT-Bangmod Kradan Kanban
        </h1>
      </div>
      <div class="flex m-4 items-center space-x-6">
        <div class="relative text-black">
          <button
            @click="toggleDropdown"
            class="flex items-center hover:text-[#4d5fcb] itbkk-fullname"
          >
            <svg
              class="mr-2"
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
            {{ username }}
            <svg
              class="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2"
          >
            <ul>
              <li>
                <button
                  @click="logout"
                  class="flex flex-row text-center px-4 py-2 hover:text-[#ba493f]"
                >
                  <img
                    src="../../assets/SignOut.png"
                    width="22"
                    height="10"
                    class="mr-2 mt-1"
                  />
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <div class="h-28"></div>
    <div class="mt-2 grid grid-cols-2 items-center">
      <div class="flex justify-start font-lilita">
        <button
          @click="closeStatusPage"
          class="ml-60 mt-2 p-2 rounded itbkk-button-home"
        >
          <p
            class="text-[#3541bb] text-lg decoration-2 hover:underline ml-2 decoration-[#3b72d9]"
          >
            Task
          </p>
        </button>
        <strong class="text-[#525454] mt-4 ml-4"> > </strong>
        <p class="text-gray-600 mt-4 ml-4">Task Status</p>
      </div>
      <div class="flex justify-center ml-44">
        <button
          class="addBtn flex text-md px-3 py-1 mt-2 mr-8 hover:bg-[#4ae77c] bg-[#4cdb79] text-black rounded itbkk-button-add font-lilita tracking-wide"
          @click="handleAddStatus"
          :disabled="isDisabled"
        >
          Add Status
        </button>
      </div>
    </div>
    <div class="mt-4 flex justify-center items-center">
      <table
        class="table-auto w-8/12 m-2 rounded-md overflow-hidden shadow-md shadow-white/40 font-lilita"
      >
        <thead class="bg-yellow-950 border-b py-4 tracking-wide text-center">
          <tr>
            <th class="text-md text-[#e9e8e8] px-4 py-2 border-r">#</th>
            <th class="text-md text-[#e9e8e8] px-4 py-2 border-r">Name</th>
            <th class="text-md text-[#e9e8e8] px-4 py-2 border-r">
              Description
            </th>
            <th class="text-md text-[#e9e8e8] px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(status, index) in statuses"
            :key="index"
            :class="index % 2 === 0 ? 'bg-yellow-50' : 'bg-orange-100'"
            class="itbkk-item border-b font-lilita"
          >
            <td
              class="px-4 py-2 whitespace-nowrap text-m font-medium text-gray-600 border-r"
            >
              {{ index + 1 }}
            </td>
            <td
              class="text-m text-gray-600 font-light px-4 py-2 whitespace-normal border-r itbkk-status-name"
            >
              {{ status.name }}
            </td>
            <td
              v-if="status.description"
              class="text-m text-gray-600 font-light px-4 py-2 border-r itbkk-status-description"
              style="word-break: break-word"
            >
              {{ status.description }}
            </td>
            <td
              v-else
              class="italic text-m text-gray-500 font-light px-4 py-2 border-r itbkk-status-description"
              style="word-break: break-word"
            >
              No description is provided
            </td>
            <td class="px-4 py-2">
              <button
                class="editBtn text-blue-800 hover:text-blue-500 mb-2 e-btn edit-delete itbkk-button-edit"
                @click="handleEditStatus(status)"
                :disabled="defaultStatus.includes(status.name) || isDisabled"
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
              <button
                class="deleteBtn text-red-700 hover:text-red-400 d-btn px-4 edit-delete itbkk-button-delete"
                @click="handleDeleteStatus(status)"
                :disabled="defaultStatus.includes(status.name) || isDisabled"
              >
                <svg
                  class="itbkk-button-delete"
                  name="Delete"
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

      <ConfirmationModal
        :show="showConfirmationModal"
        :task-title="statusToDelete?.name"
        :is-status="true"
        :statuses="statuses"
        @close="closeConfirmationModal"
        @confirm="confirmDeleteStatus"
      />

      <ConfirmationModal
        :show="showTransferModal"
        :task-title="statusToDelete?.name"
        :is-status="true"
        :statuses="statuses"
        :tasks-associated="true"
        :associated-tasks-count="statusToDelete?.associatedTasksCount"
        @close="closeTransferModal"
        @transfer="transferTasks"
      />
    </div>
  </div>
</template>

<style scoped>
.edit-delete:disabled {
  color: grey;
}

.navbar {
  background: linear-gradient(
    135deg,
    rgb(252, 255, 219) 20%,
    rgb(152, 217, 255) 40%,
    rgb(255, 221, 216) 100%
  );
}

.addBtn:disabled {
  color: #5f6566;
  background-color: #b3b5b8;
  cursor: not-allowed;
}

.editBtn:disabled,
.deleteBtn:disabled {
  color: #5f6566;
  cursor: not-allowed;
}
</style>
