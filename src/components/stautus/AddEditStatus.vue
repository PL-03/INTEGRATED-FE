<script setup>
import { ref, watchEffect, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast, POSITION } from "vue-toastification";
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  status: {
    type: Object,
    required: true,
  },
  statuses: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["update:show", "statusAdded", "statusUpdated"]);
const router = useRouter();
const isAddMode = computed(() => !props.status.id);
const isAddingNameEmpty = computed(
  () => isAddMode.value && !statusInput.value.name.trim()
);
const statusInput = ref({
  name: "",
  description: "",
});

onMounted(() => {
  if (props.status.id) {
    statusInput.value = {
      name: props.status.name,
      description: props.status.description,
    };
  }
});

watchEffect(() => {
  if (props.show) {
    const { name, description } = props.status;
    statusInput.value.name = name || "";
    statusInput.value.description = description || "";
  }
});

const isFormModified = computed(() => {
  if (isAddMode.value) {
    return true; // always true for add mode
  }

  const { name, description } = props.status;
  return (
    statusInput.value.name !== name ||
    statusInput.value.description !== (description || "")
  );
});

const closeModal = () => {
  console.log(props.status);
  emit("update:show", false);
  router.push({ name: "statusList" });
};
const handleSubmit = async () => {
  try {
    const nameToAdd = statusInput.value.name.trim().toLowerCase();
    if (existingNames.value.includes(nameToAdd)) {
      showToast(
        `Can not add status that already exists with name "${statusInput.value.name}"`,
        "error"
      );
      return;
    }
    const requestData = {
      name: statusInput.value.name.trim(),
      description: statusInput.value.description.trim() || null,
    };
    if (
      requestData.name.length > 50 ||
      (requestData.description != null && requestData.description.length > 200)
    ) {
      showToast(
        `The status name and description should be less than 50 and 200 characters respectively`,
        "error"
      );
      return;
    }
    const response = isAddMode.value
      ? await fetch(`${import.meta.env.VITE_BASE_URL}/v2/statuses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        })
      : await fetch(
          `${import.meta.env.VITE_BASE_URL}/v2/statuses/${props.status.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

    if (response.ok) {
      emit("update:show", false);
      router.push({ name: "statusList" });
      isAddMode.value ? emit("statusAdded") : emit("statusUpdated");
      showToast(
        `The status "${statusInput.value.name}" has been successfully ${
          isAddMode.value ? "added" : "updated"
        }`,
        isAddMode.value ? "success-add" : "success-update"
      );
    } else {
      const errorData = await response.json();
      if (response.status === 400) {
        const firstError = errorData.errors[0]; // first error object only for now
        showToast(`Status ${firstError.field} ${firstError.message}`, "error");
      } else {
        showToast(
          `An error occurred ${
            isAddMode.value ? "adding" : "updating"
          } the status`,
          "error"
        );
      }
    }
  } catch (error) {
    console.error(
      `Error ${isAddMode.value ? "adding" : "updating"} status:`,
      error
    );
    showToast(
      `An error occurred ${isAddMode.value ? "adding" : "updating"} the status`,
      "error"
    );
  }
};

const showToast = (message, type) => {
  const toast = useToast();

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
const existingNames = computed(() => {
  if (!props.statuses) {
    return [];
  }
  return props.statuses
    .filter((s) => s.statusId !== props.status.statusId)
    .map((statuses) => statuses.name.toLowerCase());
});
</script>

<template>
  <div v-if="show" class="modal">
    <div class="modal-content bg-gradient-to-t from-slate-300 to-yellow-50">
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="font-bold text-xl text-yellow-950">
        {{ isAddMode ? "Add" : "Edit" }} Status
      </h2>
      <br />

      <div class="itbkk-modal-status">
        <div class="itbkk-status-name text-black text-start">
          <strong class="flex ml-8 text-gray-500 text-sm mb-1">
            Status Name
            <strong v-if="isAddMode" class="text-red-700 ml-2"
              >* Limit to 50 characters</strong
            >
            <span v-else class="text-gray-400 ml-2 text-xs"
              >* Limit to 50 characters</span
            >
          </strong>
          <input
            v-model.trim="statusInput.name"
            type="text"
            class="ml-4 bg-yellow-100 rounded-md shadow-gray-400 px-8 py-2 w-11/12 shadow-md"
          />
        </div>

        <div class="w-full pr-4 mt-4 ml-2">
          <div class="itbkk-status-description text-white text-start">
            <strong class="ml-4 text-gray-500 text-sm mb-1">Description</strong>
            <span class="text-gray-400 ml-2 text-xs"
              >* Limit to 500 characters</span
            >
            <textarea
              v-model="statusInput.description"
              class="shadow-yellow-400 p-4 resize-none bg-yellow-950 w-full rounded-md"
              rows="6"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end mt-2">
          <div class="m-2">
            <button
              class="save bg-green-500 text-white font-bold py-2 px-6 rounded itbkk-button-confirm disabled"
              @click="handleSubmit"
              :disabled="isAddingNameEmpty || (!isAddMode && !isFormModified)"
            >
              Save
            </button>
          </div>
          <div class="m-2">
            <button
              class="bg-red-700 text-white font-bold py-2 px-4 rounded itbkk-button-cancel"
              @click="closeModal"
            >
              Cancel
            </button>
          </div>
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

.modal-content {
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
