<script setup>
import { ref, watchEffect, computed } from "vue"
import { useRouter } from "vue-router"
import { convertToTitleCase } from "../libs/util.js"
import { useToast, POSITION } from "vue-toastification"

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(["update:show", "taskAdded", "taskUpdated"])

const router = useRouter()
const isAddMode = computed(() => !props.task.id)

const formData = ref({
  title: "",
  description: "",
  assignees: "",
  status: "NO_STATUS",
})
const isAddingTitleEmpty = computed(
  () => isAddMode.value && !formData.value.title.trim()
)

watchEffect(() => {
  if (props.show) {
    formData.value.title = props.task.title || ""
    formData.value.description = props.task.description || ""
    formData.value.assignees = props.task.assignees || ""
    formData.value.status = props.task.status || "NO_STATUS"
  }
})

const closeModal = () => {
  emit("update:show", false)
  router.push("/task")
}

const isFormModified = computed(() => {
  if (isAddMode.value) {
    return true // Always allow saving in add mode
  }

  const { title, description, assignees, status } = props.task
  return (
    formData.value.title !== title ||
    formData.value.description !== description ||
    formData.value.assignees !== assignees ||
    formData.value.status !== status
  )
})

const handleSubmit = async () => {
  try {
    const response = isAddMode.value
      ? await fetch(`${import.meta.env.VITE_BASE_URL}/v1/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData.value),
        })
      : await fetch(
          `${import.meta.env.VITE_BASE_URL}/v1/tasks/${props.task.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData.value),
          }
        )

    if (response.ok) {
      emit("update:show", false)
      router.push("/task")
      isAddMode.value ? emit("taskAdded") : emit("taskUpdated")
      showToast(
        `The task "${formData.value.title}" has been successfully ${
          isAddMode.value ? "added" : "updated"
        }`,
        isAddMode.value ? "success-add" : "success-update"
      )
    } else {
      showToast(
        `An error occurred ${isAddMode.value ? "adding" : "updating"} the task`,
        "error"
      )
    }
  } catch (error) {
    console.error(
      `Error ${isAddMode.value ? "adding" : "updating"} task:`,
      error
    )
    showToast(
      `An error occurred ${isAddMode.value ? "adding" : "updating"} the task`,
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

const formatDate = (dateString) => {
  if (!dateString) return "Date is undefined"

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hourCycle: "h24",
  }
  const utcDate = new Date(dateString)
  const formatter = new Intl.DateTimeFormat("en-GB", options)
  const formattedDate = formatter.format(utcDate)
  return formattedDate
}
</script>

<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="font-bold text-xl text-yellow-950">
        {{ isAddMode ? "Add" : "Edit" }} Task
      </h2>
      <br />
      <div class="itbkk-title">
        <strong>Title</strong>
        <input
          v-model.trim="formData.title"
          type="text"
          maxlength="100"
          class="mx-auto bg-gray-100 rounded-md w-full"
        />
      </div>
      <div
        class="task-details-container border rounded-3xl bg-yellow-50 p-4 m-4 shadow-md"
      >
        <div class="task-details-left ml-4">
          <div class="itbkk-description mt-4">
            <strong>Description</strong>
            <textarea
              v-model="formData.description"
              class="itbkk-description resize-none bg-blue-100 w-full"
              rows="18"
              maxlength="500"
            ></textarea>
          </div>
        </div>

        <div class="task-details-right flex flex-col justify-between mr-4">
          <div class="itbkk-assignee mt-4 mb-4">
            <strong>Assignees</strong>
            <textarea
              v-model.trim="formData.assignees"
              class="bg-blue-100 w-full"
              rows="4"
              maxlength="30"
            ></textarea>
          </div>
          <div class="itbkk-status mb-5">
            <strong>Status</strong>
            <select
              v-model="formData.status"
              class="bg-blue-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="NO_STATUS">
                {{ convertToTitleCase("NO_STATUS") }}
              </option>
              <option value="TO_DO">{{ convertToTitleCase("TO_DO") }}</option>
              <option value="DOING">{{ convertToTitleCase("DOING") }}</option>
              <option value="DONE">{{ convertToTitleCase("DONE") }}</option>
            </select>
          </div>
          <div
            class="timeBox bg-blue-100 text-wrap box-content border rounded-lg p-4"
          >
            <div class="itbkk-timezone m-1">
              <strong>Time Zone</strong>
              <textarea
                class="bg-white w-full"
                rows="2"
                disabled
                v-model="Intl.DateTimeFormat().resolvedOptions().timeZone"
              ></textarea>
            </div>
            <div v-if="!isAddMode" class="itbkk-created-on m-2">
              <strong>Created Date:</strong>
              {{ formatDate(props.task.createdOn) }}
            </div>
            <div v-if="!isAddMode" class="itbkk-updated-on">
              <strong>Updated Date:</strong>
              {{ formatDate(props.task.updatedOn) }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-end">
        <div class="m-4">
          <button
            class="bg-green-500 text-white font-bold py-2 px-4 rounded"
            @click="handleSubmit"
            :disabled="isAddingTitleEmpty || (!isAddMode && !isFormModified)"
          >
            Save
          </button>
        </div>
        <div class="m-4">
          <button
            class="bg-red-500 text-white font-bold py-2 px-4 rounded"
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
