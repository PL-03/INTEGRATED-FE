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
      name: props.statuses.title,
      description: props.statuses.description,
    }
  }
})
watchEffect(() => {
  if (props.show) {
    statusInput.value.name = props.statuses.name || ""
    statusInput.value.description = props.statuses.description || ""
  }
})
const closeModal = () => {
  emit("update:show", false)
  router.push("/status/manage")
  console.log(!props.statuses.statusId)
}
const isFormModified = computed(() => {
  if (isAddMode.value) {
    return true
  }

  const { name, description } = props.statuses
  return (
    statusInput.value.name !== name ||
    statusInput.value.description !== (description || "")
  )
})
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
      router.push("/status/manage")
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

      <div class="itbkk-status-name mb-4">
        <strong>Status Name:</strong><br />
        <input
          v-model.trim="statusInput.name"
          type="text"
          maxlength="100"
          class="mx-auto bg-gray-300 rounded-md px-4 py-2 w-10/12 shadow-md"
        />
      </div>

      <div class="flex justify-between mt-8">
        <div class="w-3/5 pr-4 mb-8 ml-12">
          <div class="itbkk-description">
            <strong>Description</strong>
            <textarea
              v-model="statusInput.description"
              class="shadow-lg shadow-gray-500/50 p-8 resize-none bg-yellow-100 w-full rounded-lg"
              rows="18"
              maxlength="500"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end">
          <div class="m-4">
            <button
              class="bg-green-500 text-white font-bold py-2 px-4 rounded itbkk-button-confirm disabled"
              @click="handleSubmit"
              :disabled="isAddingNameEmpty || (!isAddMode && !isFormModified)"
            >
              Save
            </button>
          </div>
          <div class="m-4">
            <button
              class="bg-red-500 text-white font-bold py-2 px-4 rounded itbkk-button-cancel"
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
  width: 80%;
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
</style>
