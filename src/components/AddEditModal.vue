<script setup>
import { ref, watchEffect, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast, POSITION } from "vue-toastification";
import { getToken, useRefreshToken } from "@/services/tokenService";

const props = defineProps({
  show: { type: Boolean, required: true },
  task: { type: Object, required: true },
  statuses: { type: Array, required: true },
});

const emit = defineEmits(["update:show", "task-added", "task-updated"]);
const route = useRoute();
const boardId = route.params.boardId;
const router = useRouter();
const toast = useToast(); // Moved here

const selectedStatus = ref(props.task.status || null);
const formData = ref({
  title: "",
  description: "",
  assignees: "",
  status: null,
});

const isAddMode = computed(() => !props.task.id);
const isAddingTitleEmpty = computed(
  () => isAddMode.value && !formData.value.title.trim()
);

onMounted(() => {
  if (props.task.id) {
    formData.value = {
      title: props.task.title,
      description: props.task.description,
      assignees: props.task.assignees,
      status: (selectedStatus.value = props.task.status),
    };
  }
});

watchEffect(() => {
  if (props.show) {
    const { title, description, assignees, status } = props.task;
    formData.value.title = title || "";
    formData.value.description = description || "";
    formData.value.assignees = assignees || "";
    selectedStatus.value = status || null;
  }
});

const closeModal = () => {
  emit("update:show", false);
  router.push({ name: "tasklist" });
};

const isFormModified = computed(() => {
  if (isAddMode.value) {
    return true; // always true for add mode
  }
  const { title, description, assignees, status } = props.task;
  const statusChanged =
    selectedStatus.value && selectedStatus.value.id !== (status?.id || null);
  const otherFieldsChanged =
    formData.value.title !== (title || "") ||
    formData.value.description !== (description || "") ||
    formData.value.assignees !== (assignees || "");

  return statusChanged || otherFieldsChanged;
});

const filteredStatuses = computed(() =>
  props.statuses.filter((status) => status.id !== props.task.status?.id)
);

const handleSubmit = async () => {
  try {
    const requestData = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim() || null,
      assignees: formData.value.assignees.trim() || null,
      status: selectedStatus.value ? selectedStatus.value.id : null,
    };

    // Validate lengths
    if (
      requestData.title.length > 100 ||
      (requestData.assignees && requestData.assignees.length > 30) ||
      (requestData.description && requestData.description.length > 500)
    ) {
      showToast(
        "The task name, assignees, and description should be less than 100, 30, and 500 characters respectively.",
        "error"
      );
      return;
    }

    const token = getToken();
    if (!token) {
      await useRefreshToken();
      token = getToken();
    }

    const response = isAddMode.value
      ? await fetch(
          `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/tasks`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        )
      : await fetch(
          `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/tasks/${
            props.task.id
          }`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

    if (response.ok) {
      emit("update:show", false);
      router.push({ name: "tasklist" });
      isAddMode.value ? emit("task-added") : emit("task-updated");
      showToast(
        `The task "${formData.value.title}" has been successfully ${
          isAddMode.value ? "added" : "updated"
        }`,
        isAddMode.value ? "success-add" : "success-update"
      );
    } else if (response.status === 401) {
      localStorage.removeItem("jwtToken");
      router.push({ name: "login" });
    } else if (response.status === 403) {
      showToast(
        `You don't have permission to ${
          isAddMode.value ? "add" : "update"
        } the task.`,
        "error"
      );
    } else {
      showToast(
        `An error occurred ${
          isAddMode.value ? "adding" : "updating"
        } the task.`,
        "error"
      );
    }
  } catch (error) {
    console.error(
      `Error ${isAddMode.value ? "adding" : "updating"} task:`,
      error
    );
    showToast(
      `An error occurred ${
        isAddMode.value ? "adding" : "updating"
      } the task. Please try again.`,
      "error"
    );
  }
};

const showToast = (message, type) => {
  switch (type) {
    case "success-add":
    case "success-update":
      toast.success(message, { position: POSITION.TOP_CENTER, timeout: 3000 });
      break;
    case "error":
      toast.error(message, { position: POSITION.TOP_CENTER, timeout: 3000 });
      break;
    default:
      toast(message);
  }
};
</script>

<template>
  <div v-if="show" class="modal">
    <div
      class="itbkk-modal-task bg-gradient-to-t from-slate-300 to-yellow-50 font-lilita"
    >
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="font-bold text-xl text-blue-800 mt-2">
        {{ isAddMode ? "Add" : "Edit" }} Task
      </h2>
      <br />

      <div class="itbkk-title mb-2 text-start">
        <p class="flex text-gray-500 text-sm ml-10 mb-1">
          Title
          <span v-if="isAddMode" class="text-red-700 ml-2 text-xs"
            >* Limit to 100 characters
          </span>
          <span v-else class="text-gray-400 ml-2 text-xs"
            >* Limit to 100 characters</span
          >
        </p>
        <input
          v-model.trim="formData.title"
          type="text"
          class="ml-6 bg-gray-300 rounded-md px-4 py-2 w-11/12 shadow-md"
        />
      </div>

      <div class="flex justify-between mt-4">
        <div class="w-3/5 pr-4 mb-4 ml-4">
          <div class="itbkk-description text-start">
            <p class="flex text-gray-500 text-sm ml-4">
              Description
              <span class="text-gray-400 ml-2 text-xs"
                >* Limit to 500 characters</span
              >
            </p>
            <textarea
              v-model="formData.description"
              class="shadow-lg shadow-gray-500/50 p-8 resize-none bg-yellow-100 w-full rounded-lg"
              rows="8"
            ></textarea>
          </div>
        </div>

        <div class="w-2/5 pl-4 mr-8">
          <div class="mt-2 mb-2 text-start">
            <p class="text-gray-500 text-sm ml-4 flex">
              Assignees
              <span class="text-gray-400 ml-2 text-xs"
                >* Limit to 30 characters</span
              >
            </p>
            <textarea
              v-model.trim="formData.assignees"
              class="shadow-md p-4 bg-blue-200 w-full rounded-lg itbkk-assignees"
              rows="3"
            ></textarea>
          </div>

          <div class="itbkk-status mt-2 text-start">
            <p class="text-gray-500 text-sm ml-4">Status</p>

            <select
              @click="check(props.task.status)"
              v-model="selectedStatus"
              class="itbkk-status shadow-md bg-blue-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option :value="props.task.status" selected>
                {{ props.task.status }}
              </option>
              <option
                v-for="status in filteredStatuses"
                :key="status.id"
                :value="status"
              >
                {{ status.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <div class="m-2">
          <button
            class="save bg-green-500 text-white py-2 px-6 rounded itbkk-button-confirm disabled"
            @click="handleSubmit"
            :disabled="isAddingTitleEmpty || (!isAddMode && !isFormModified)"
          >
            Ok
          </button>
        </div>
        <div class="m-2">
          <button
            class="bg-red-700 text-white py-2 px-4 rounded itbkk-button-cancel"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.itbkk-modal-task {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
  max-height: 80vh;
  overflow-y: auto;
}

.itbkk-description span {
  word-wrap: break-word;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.itbkk-description textarea {
  resize: vertical;
}

.save:disabled {
  background-color: #7777779f;
  color: #fefefe;
}
</style>
