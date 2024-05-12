<script setup>
import { ref, watchEffect, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useToast, POSITION } from "vue-toastification"
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  statuses: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(["update:show", "statusAdded", "statusUpdated"])
const router = useRouter()
const isAddMode = computed(() => !props.statuses.statusId)
const isAddingNameEmpty = computed(
  () => isAddMode.value && !statusInput.value.name.trim()
)
const statusInput = ref({
  name: "",
  description: "",
})

onMounted(() => {
  if (props.statuses.statusId) {
    statusInput.value = {
      name: props.statuses.name,
      description: props.statuses.description,
    }
  }
})

watchEffect(() => {
  if (props.show) {
    const { name, description } = props.statuses
    statusInput.value.name = name || ""
    statusInput.value.description = description || ""
  }
})

const isFormModified = computed(() => {
  if (isAddMode.value) {
    return true // always true for add mode
  }

  const { name, description } = props.statuses
  return (
    statusInput.value.name !== name ||
    statusInput.value.description !== (description || "")
  )
})

const closeModal = () => {
  emit("update:show", false)
  router.push("/status")
  console.log(!props.statuses.statusId)
}
const handleSubmit = async () => {
  try {
    const requestData = {
      name: statusInput.value.name.trim(),
      description: statusInput.value.description.trim() || null,
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
          `${import.meta.env.VITE_BASE_URL}/v2/statuses/${
            props.statuses.statusId
          }`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        )

    if (response.ok) {
      emit("update:show", false)
      router.push("/status")
      isAddMode.value ? emit("statusAdded") : emit("statusUpdated")
      showToast(
        `The status "${statusInput.value.name}" has been successfully ${
          isAddMode.value ? "added" : "updated"
        }`,
        isAddMode.value ? "success-add" : "success-update"
      )
    } else {
      showToast(
        `An error occurred ${
          isAddMode.value ? "adding" : "updating"
        } the status`,
        "error"
      )
    }
  } catch (error) {
    console.error(
      `Error ${isAddMode.value ? "adding" : "updating"} status:`,
      error
    )
    showToast(
      `An error occurred ${isAddMode.value ? "adding" : "updating"} the status`,
      "error"
    )
  }
}
const showToast = (message, type) => {
  const toast = useToast()

  switch (type) {
    case "success-add":
      toast.success(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      })
      break
    case "success-update":
      toast.success(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      })
      break
    case "error":
      toast.error(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      })
      break
    default:
      toast(message)
  }
}
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
            <strong v-if="isAddMode" class="text-red-700 ml-2">*</strong>
          </strong>
          <input
            v-model.trim="statusInput.name"
            type="text"
            maxlength="100"
            class="ml-4 bg-yellow-100 rounded-md shadow-gray-400 px-8 py-2 w-11/12 shadow-md"
          />
        </div>

        <div class="w-full pr-4 mt-4 ml-2">
          <div class="itbkk-status-description text-white text-start">
            <strong class="ml-4 text-gray-500 text-sm mb-1">Description</strong>
            <textarea
              v-model="statusInput.description"
              class="shadow-yellow-400 p-4 resize-none bg-yellow-950 w-full rounded-md"
              rows="6"
              maxlength="500"
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
