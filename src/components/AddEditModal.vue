<script setup>
import { ref, watchEffect, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
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
  statuses: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(["update:show", "taskAdded", "taskUpdated"])
const selectedStatus = ref(props.task.status || null)
const router = useRouter()
const isAddMode = computed(() => !props.task.id)

const selectedStatusOption = computed({
  get: () => {
    if (props.task.status) {
      return props.task.status
    } else {
      return null
    }
  },
  set: (newValue) => {
    selectedStatus.value = newValue
  },
})

const formData = ref({
  title: "",
  description: "",
  assignees: "",
  status: null,
})
const isAddingTitleEmpty = computed(
  () => isAddMode.value && !formData.value.title.trim()
)

onMounted(() => {
  if (props.task.id) {
    formData.value = {
      title: props.task.title,
      description: props.task.description,
      assignees: props.task.assignees,
      status: props.task.status,
    }
  }
})

watchEffect(() => {
  if (props.show) {
    formData.value.title = props.task.title || ""
    formData.value.description = props.task.description || ""
    formData.value.assignees = props.task.assignees || ""
    formData.value.status = selectedStatusOption.value
  }
})

const closeModal = () => {
  emit("update:show", false)
  router.push("/task")
}

const isFormModified = computed(() => {
  if (isAddMode.value) {
    return true // always true for add mode
  }

  const { title, description, assignees, status } = props.task
  return (
    formData.value.title !== title ||
    formData.value.description !== (description || "") ||
    formData.value.assignees !== (assignees || "") ||
    (selectedStatusOption.value &&
      selectedStatusOption.value.statusId !== status?.statusId)
  )
})

const handleSubmit = async () => {
  try {
    const requestData = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim() || null,
      assignees: formData.value.assignees.trim() || null,
      status: selectedStatus.value ? selectedStatus.value.statusId : null,
    }

    const response = isAddMode.value
      ? await fetch(`${import.meta.env.VITE_BASE_URL}/v1/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        })
      : await fetch(
          `${import.meta.env.VITE_BASE_URL}/v1/tasks/${props.task.id}`,
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
      router.push("/task")
      isAddMode.value ? emit("task-added") : emit("task-updated")
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
const tryCicked = () => {
  console.log(props.statuses)
}
</script>

<template>
  <div v-if="show" class="modal">
    <div class="modal-content bg-gradient-to-t from-slate-300 to-yellow-50">
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="font-bold text-xl text-yellow-950">
        {{ isAddMode ? "Add" : "Edit" }} Task
      </h2>
      <br />

      <div class="itbkk-title mb-4">
        <strong>Title</strong><br />
        <input
          v-model.trim="formData.title"
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
              v-model="formData.description"
              class="shadow-lg shadow-gray-500/50 p-8 resize-none bg-yellow-100 w-full rounded-lg"
              rows="18"
              maxlength="500"
            ></textarea>
          </div>
        </div>

        <div class="w-2/5 pl-4 mr-8">
          <div class="itbkk-assignee mt-2 mb-4">
            <strong>Assignees</strong>
            <textarea
              v-model.trim="formData.assignees"
              class="shadow-md p-4 bg-blue-200 w-full rounded-lg"
              rows="5"
              maxlength="30"
            ></textarea>
          </div>

          <div class="itbkk-status mx-4" @click="tryCicked">
            <strong>Status</strong>
            <select
              v-model="selectedStatusOption"
              class="shadow-md bg-blue-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option :value="props.task.status">
                {{ props.task.status?.name }}
              </option>
              <option
                v-for="status in props.statuses.filter(
                  (s) => s.statusId !== props.task.status?.statusId
                )"
                :key="status.statusId"
                :value="status"
              >
                {{ status.name }}
              </option>
            </select>
          </div>

          <div
            v-if="!isAddMode"
            class="timeBox bg-blue-200 text-wrap box-content border shadow-md rounded-lg p-4 mt-10"
          >
            <div class="itbkk-timezone">
              <strong>Time Zone</strong>
              <textarea
                class="p-4 bg-gray-100 rounded-lg w-full"
                rows="2"
                disabled
                v-model="Intl.DateTimeFormat().resolvedOptions().timeZone"
              ></textarea>
            </div>
            <div class="itbkk-created-on mt-2">
              <strong>Created Date:</strong>
              {{ formatDate(props.task.createdOn) }}
            </div>
            <div class="itbkk-updated-on">
              <strong>Updated Date:</strong>
              {{ formatDate(props.task.updatedOn) }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <div class="m-2">
          <button
            class="save bg-green-500 text-white font-bold py-2 px-6 rounded itbkk-button-confirm disabled"
            @click="handleSubmit"
            :disabled="isAddingTitleEmpty || (!isAddMode && !isFormModified)"
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

.save:disabled {
  background-color: #7777779f;
  color: #fefefe;
}
</style>

<!-- add Status -->
<!-- <template>
  <div v-if="show" class="modal">
    <div class="modal-content bg-gradient-to-t from-slate-300 to-yellow-50">
     
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="font-bold text-xl text-yellow-950 mt-6">
        {{ isAddMode ? "Add" : "Edit" }} Status
      </h2>
      <br />

      <div class="itbkk-modal-status ">
        <div class="itbkk-status-name text-black text-start">
          <strong class="ml-8 text-gray-500">Name</strong><br />
          <input v-model.trim="formData.title" type="text" maxlength="100"
            class="ml-4 mt-1 bg-yellow-100 rounded-md px-8 py-2 w-11/12 shadow-md " />
        </div>

        
          <div class="w-full pr-4 mt-4 mb-4 ml-2">
            <div class="itbkk-status-description text-white text-start">
              <strong class="ml-4 text-gray-500">Description</strong>
              <textarea v-model="formData.description"
                class="shadow-lg shadow-gray-500/50 mt-2 p-4 resize-none bg-yellow-950 w-full rounded-md" rows="6"
                maxlength="500"></textarea>
            </div>
          </div>


        <div class="flex justify-end ">
          <div class="m-2">
            <button class="save bg-green-500 text-white font-bold py-2 px-6 rounded itbkk-button-confirm disabled"
              @click="handleSubmit" :disabled="isAddingTitleEmpty || (!isAddMode && !isFormModified)">
              Save
            </button>
          </div>
          <div class="m-2">
            <button class="bg-red-700 text-white font-bold py-2 px-4 rounded itbkk-button-cancel" @click="closeModal">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> -->

<!-- Edit Status -->
<!-- <template>
  <div v-if="show" class="modal">
    <div class="modal-content bg-gradient-to-t from-slate-300 to-yellow-50">


      <span class="close" @click="closeModal">&times;</span>
      <h2 class="font-bold text-xl text-yellow-950 mt-4">
        {{ isAddMode ? "Add" : "Edit" }} Status
      </h2>
      <br />

      <div class="itbkk-modal-status ">
        <div class="itbkk-status-name text-black text-start">
          <strong class="ml-8 text-gray-500">Name</strong><br />
          <input v-model.trim="formData.status.name" type="text" maxlength="100"
            class="ml-4 bg-yellow-100 rounded-md shadow-gray-400 px-8 py-2 w-11/12 shadow-md " />
        </div>


        <div class="w-full pr-4 mt-4  ml-2">
          <div class="itbkk-status-description text-white text-start">
            <strong class="ml-4 text-gray-500">Description</strong>
            <textarea v-model="formData.status.description"
              class="shadow-yellow-400  p-4 resize-none bg-yellow-950 w-full rounded-md" rows="6"
              maxlength="500"></textarea>
          </div>
        </div>

        <div v-if="!isAddMode" class="flex ml-4 text-gray-500 ">
          <div class="itbkk-timezone bg-yellow-100 rounded-lg mt-4 px-10 py-4 shadow-md shadow-gray-400">
            <p><strong>Time Zone</strong><br>
              {{ Intl.DateTimeFormat().resolvedOptions().timeZone }}
            </p>
          </div>
          <div class="itbkk-created-on bg-yellow-100 rounded-lg mt-4 ml-6 px-4 py-4 shadow-md shadow-gray-400">
            <strong>Created Date</strong><br>
            {{ formatDate(props.task.createdOn) }}
          </div>
          <div class="itbkk-updated-on bg-yellow-100 rounded-lg mt-4 ml-6 px-4 py-4 shadow-md shadow-gray-400">
            <strong>Updated Date</strong><br>
            {{ formatDate(props.task.updatedOn) }}
          </div>
        </div>

        <div class="flex justify-end mt-2">
          <div class="m-2">
            <button class="save bg-green-500 text-white font-bold py-2 px-6 rounded itbkk-button-confirm disabled"
              @click="handleSubmit" :disabled="isAddingTitleEmpty || (!isAddMode && !isFormModified)">
              Save
            </button>
          </div>
          <div class="m-2">
            <button class="bg-red-700 text-white font-bold py-2 px-4 rounded itbkk-button-cancel" @click="closeModal">
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template> -->
