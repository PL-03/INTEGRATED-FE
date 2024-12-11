<script setup>
import { ref, watch, watchEffect, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast, POSITION } from "vue-toastification";
import {
  getToken,
  useRefreshToken,
  removeTokens,
} from "@/services/tokenService";
const props = defineProps({
  show: { type: Boolean, required: true },
  task: { type: Object, required: true },
  statuses: { type: Array, required: true },
});
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const mimeTypes = {
  ".zip": "application/x-zip-compressed",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".txt": "text/plain",
  ".json": "application/json",
  // Add more extensions as needed
};
function getMimeType(fileName) {
  const ext = fileName.slice(fileName.lastIndexOf("."));
  return mimeTypes[ext] || "application/octet-stream";
}
const emit = defineEmits(["update:show", "task-added", "task-updated"]);
const route = useRoute();
const boardId = route.params.boardId;
const router = useRouter();
const toast = useToast(); // Moved here
const files = ref([]);
const preparedFiles = ref([]);
const removedFile = ref({});
const countRemoved = ref(0);
const filteredStatuses = computed(() =>
  props.statuses.filter((status) => status.name !== props.task.status)
);
const handleFileInput = (event) => {
  const newFiles = Array.from(event.target.files);

  // Check for duplicates and file size limit
  const existingFileNames = files.value.map((file) => file.name);
  const exceededSizeFiles = newFiles.filter(
    (file) => file.size > MAX_FILE_SIZE
  );
  const duplicateFiles = newFiles.filter((file) =>
    existingFileNames.includes(file.name)
  );

  // Show warnings for invalid files
  if (exceededSizeFiles.length > 0) {
    showToast(
      `The following files exceed the 20MB limit: ${exceededSizeFiles
        .map((file) => file.name)
        .join(", ")}`,
      "error"
    );
  }

  if (duplicateFiles.length > 0) {
    showToast(
      `The following files are duplicates: ${duplicateFiles
        .map((file) => file.name)
        .join(", ")}`,
      "error"
    );
  }

  // Only add valid files
  const validFiles = newFiles.filter(
    (file) =>
      file.size <= MAX_FILE_SIZE && !existingFileNames.includes(file.name)
  );
  files.value = [...files.value, ...validFiles];
};
const removeFile = (index) => {
  removedFile.value = files.value[index];
  files.value.splice(index, 1);

  // If editing, ensure the removed file is also removed from task.attachments
  if (!isAddMode.value && props.task.attachments) {
    props.task.attachments = props.task.attachments.filter(
      (attachment) => attachment.name !== removedFile.value.name
    );
  }
  countRemoved.value++;
  removedFile.value = null;
};
const selectedStatus = ref("");
const formFields = ref({
  title: "",
  description: "",
  assignees: "",
  status: null,
});
const isAddMode = computed(() => !props.task.id);
const isAddingTitleEmpty = computed(() => {
  return isAddMode.value && !formFields.value.title.trim();
});

onMounted(() => {
  selectedStatus.value = props.task.status || null;
  if (props.task.id) {
    formFields.value = {
      title: props.task.title || "",
      description: props.task.description || "",
      assignees: props.task.assignees || "",
      status: props.task.status || null,
    };
    selectedStatus.value = props.task.status || null;
  }
});
watch(
  () => props.task.attachments,
  (newAttachments) => {
    const existingFileNames = files.value.map((file) => file.name);
    const filteredAttachments = (newAttachments || []).filter(
      (attachment) => !existingFileNames.includes(attachment.name)
    );
    files.value = [...filteredAttachments, ...files.value];
  }
);
watchEffect(() => {
  if (props.show) {
    formFields.value = {
      title: props.task.title || "",
      description: props.task.description || "",
      assignees: props.task.assignees || "",
      status: props.task.status || null,
    };
    selectedStatus.value = props.task.status || null;
  }
});
watchEffect(() => {
  if (!props.show) {
    files.value = [];
  }
});
const closeModal = () => {
  emit("update:show", false);
  router.push({ name: "tasklist" });
};

const isFormModified = computed(() => {
  if (isAddMode.value) {
    return true; // Always allow modifications in add mode
  }
  const { title, description, assignees, status, attachments } = props.task;
  const statusChanged =
    selectedStatus.value?.id !== props.task.status?.id ||
    selectedStatus.value !== props.task.status;
  const otherFieldsChanged =
    formFields.value.title !== (title || "") ||
    formFields.value.description !== (description || "") ||
    formFields.value.assignees !== (assignees || "");

  // Check if file attachments have changed
  const hasFilesChanged =
    files.value.length !== (attachments?.length || 0) ||
    (attachments || []).some(
      (attachment) => !files.value.some((file) => file.name === attachment.name)
    ) ||
    countRemoved.value > 0;

  return statusChanged || otherFieldsChanged || hasFilesChanged;
});

const downloadAttachment = async (fileName) => {
  try {
    let token = getToken();
    if (!token) {
      await useRefreshToken();
      token = getToken();
    }

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/tasks/${
        props.task.id
      }/attachments/${fileName}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download error:", error);
    showToast("Failed to download file", "error");
  }
};

// Method to preview a file attachment
const previewAttachment = async (fileName) => {
  try {
    let token = getToken();
    if (!token) {
      await useRefreshToken();
      token = getToken();
    }

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/tasks/${
        props.task.id
      }/attachments/${fileName}/preview`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Please upload the file first");
    }

    const blob = await response.blob();
    const mimeType = getMimeType(fileName);

    if (mimeType.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(blob);
      window.open(imageUrl, "_blank");
    } else if (mimeType === "application/pdf") {
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
    } else {
      downloadAttachment(fileName);
    }
  } catch (error) {
    console.error("Preview error:", error);
    showToast("Failed to preview file", "error");
  }
};

const handleSubmit = async () => {
  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const data = new FormData();

    // Prepare task data
    const requestData = {
      title: formFields.value.title.trim(),
      description: formFields.value.description.trim() || null,
      assignees: formFields.value.assignees.trim() || null,
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

    // If editing an existing task, fetch existing attachments
    if (
      !isAddMode.value &&
      props.task.attachments &&
      props.task.attachments.length > 0
    ) {
      // Fetch existing attachments
      for (const attachment of props.task.attachments) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/tasks/${
              props.task.id
            }/attachments/${attachment.name}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch attachment: ${attachment.name}`);
          }

          const blob = await response.blob();
          const file = new File([blob], attachment.name, {
            type: attachment.type || getMimeType(attachment.name),
          });

          preparedFiles.value.push(file);
        } catch (error) {
          console.error(`Error fetching attachment ${attachment.name}:`, error);
          showToast(`Failed to fetch attachment ${attachment.name}`, "error");
        }
      }
    }
    // Add newly added files
    files.value.forEach((file) => {
      console.log(
        !preparedFiles.value.some(
          (existingFile) => existingFile.name === file.name
        )
      );

      if (
        !preparedFiles.value.some(
          (existingFile) => existingFile.name === file.name
        )
      ) {
        preparedFiles.value.push(file);
      }
    });
    // Exclude removed attachments
    if (!isAddMode.value && props.task.attachments) {
      const remainingAttachments = props.task.attachments.filter((attachment) =>
        files.value.some((file) => file.name === attachment.name)
      );
      props.task.attachments = remainingAttachments;
    }

    data.append("task", JSON.stringify(requestData));

    preparedFiles.value.forEach((file) => {
      data.append("files", file);
    });

    // Submit the task
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
            },
            body: data,
          }
        );

    if (response.ok) {
      emit("update:show", false);
      router.push({ name: "tasklist" });
      emit(isAddMode.value ? "task-added" : "task-updated");
      showToast(
        `The task "${formFields.value.title}" has been successfully ${
          isAddMode.value ? "added" : "updated"
        }.`,
        isAddMode.value ? "success-add" : "success-update"
      );
    } else if (response.status === 401) {
      await handleUnauthorized();
    } else if (response.status === 403) {
      showToast("You don't have permission to modify this task.", "error");
    } else {
      showToast("An error occurred while submitting the task.", "error");
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

// Handle drag and drop
const handleFileDrop = (event) => {
  const droppedFiles = Array.from(event.dataTransfer.files);
  files.value = [...files.value, ...droppedFiles];
};

// Trigger file input
const triggerFileInput = () => {
  const fileInput = document.querySelector('input[type="file"]');
  fileInput.click();
};
</script>

<template>
  <div v-if="show" class="modal">
    <div
      class="itbkk-modal-task bg-gradient-to-t from-slate-300 to-yellow-50 font-lilita ovrflow-hidden"
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
          v-model="formFields.title"
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
              v-model="formFields.description"
              class="shadow-lg shadow-gray-500/50 p-8 resize-none bg-yellow-100 w-full rounded-lg"
              rows="8"
            ></textarea>
          </div>
        </div>

        <div class="w-2/5 pl-4 mr-8">
          <div class="my-2 text-start">
            <p class="text-gray-500 text-sm ml-4 flex">
              Assignees
              <span class="text-gray-400 ml-2 text-xs"
                >* Limit to 30 characters</span
              >
            </p>
            <textarea
              v-model.trim="formFields.assignees"
              class="shadow-md p-4 bg-blue-200 w-full rounded-lg itbkk-assignees"
              rows="3"
            ></textarea>
          </div>

          <div class="itbkk-status mt-2 text-start">
            <p class="text-gray-500 text-sm ml-4">Status</p>

            <select
              v-model="selectedStatus"
              class="itbkk-status shadow-md bg-blue-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option :value="props.task.status">
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

      <div class="flex flex-col items-center p-6 mb-4" v-if="!isAddMode">
        <!-- Drop Zone -->
        <div
          class="border-dashed border-2 border-gray-400 rounded p-6 w-full text-center bg-gray-50 hover:bg-gray-100 transition"
          @dragover.prevent
          @dragenter.prevent
          @drop.prevent="handleFileDrop"
        >
          <p class="text-sm text-gray-600">
            Drag and drop your files here or click to upload
          </p>
          <input
            type="file"
            multiple
            @change="handleFileInput"
            ref="fileInput"
            class="hidden"
          />
          <button
            @click="triggerFileInput"
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Choose Files
          </button>
        </div>

        <!-- File List -->
        <ul v-if="files.length" class="text-sm mt-4 w-full">
          <li
            v-for="(file, index) in files"
            :key="index"
            class="group relative flex items-center bg-[#f4f2e8] w-full rounded p-2 mb-2"
          >
            <!-- Remove Button -->
            <button
              @click="removeFile(index)"
              class="absolute top-2 right-2 text-red-600 hover:underline"
            >
              Remove
            </button>

            <!-- File Action Buttons -->
            <div class="flex items-center space-x-2">
              <!-- Download Button -->
              <button
                @click="downloadAttachment(file.name)"
                class="text-blue-600 hover:underline text-sm"
                title="Download"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-9.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <!-- Preview Button -->
              <button
                @click="previewAttachment(file.name)"
                class="text-green-600 hover:underline text-sm"
                title="Preview"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <!-- File Icon -->
            <img src="../assets/filePic.png" class="w-8 h-8 m-2" />

            <!-- File Name -->
            <span
              class="truncate text-ellipsis overflow-hidden ml-2"
              style="max-width: calc(100% - 3rem)"
            >
              {{ file.name }}
            </span>

            <!-- Tooltip -->
            <div
              class="absolute left-0 top-full mt-1 w-auto max-w-xs bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              {{ file.name }}
            </div>
          </li>
        </ul>
        <p v-else>No files uploaded</p>
      </div>

      <div class="flex justify-end">
        <div class="m-2">
          <button
            class="save bg-green-600 hover:bg-green-500 text-white py-2 px-6 rounded itbkk-button-confirm disabled"
            @click="handleSubmit"
            :disabled="isAddingTitleEmpty || (!isAddMode && !isFormModified)"
          >
            Ok
          </button>
        </div>
        <div class="m-2">
          <button
            class="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded itbkk-button-cancel"
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
  height: 90vh;
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
.group-hover:opacity-100 {
  opacity: 1 !important;
}

.group {
  position: relative;
}
.border-dashed:hover {
  border-color: #3b82f6;
}
</style>
