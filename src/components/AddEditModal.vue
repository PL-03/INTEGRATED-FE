<script setup>
import { ref, watch, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
const route = useRoute()
const router = useRouter()
const handleSubmit = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(initialFormValues.value),
    })

    if (response.ok) {
      // Handle successful response
      console.log("Task added successfully")
      router.push("/task")
    } else {
      // Handle error response
      console.error("Error adding task:", response.statusText)
    }
  } catch (error) {
    console.error("Error adding task:", error)
  }
}
const props = defineProps({
  initialFormValues: {
    type: Object,
    required: true,
    default: () => ({
      title: "",
      description: "",
      assignees: "",
      status: "NO_STATUS",
    }),
  },
})
const isAddingNewTask = computed(() => route.path.includes("/add"))

// const isModalOpen = ref(false)



const formatDate = (dateString) => {
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

const closeModal = () => {
  router.push("/task")
}
</script>

<template>
  <v-form>
    <div v-if="isAddingNewTask" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div>
          <v-text-field v-model="initialFormValues.title" label="Task Title" />
        </div>
        <div>
          <v-textarea
            v-model="initialFormValues.description"
            label="Task Description"
          />
        </div>
        <div>
          <v-textarea
            v-model="initialFormValues.assignees"
            label="Task Assignees"
          />
        </div>
        <div>
          <v-btn color="primary" @click="handleSubmit">Add Task</v-btn>
        </div>
      </div>
    </div>
  </v-form>
  
<!-- Edit ล่าสุด -->
  <!-- <v-form>
    <div v-if="Object.keys(selectedTaskId).length > 0" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2 class="font-bold text-xl text-yellow-950 m-4">Task Details</h2>


        <div class="itbkk-title">
          <strong>Title</strong>
          <v-responsive class="mx-auto bg-gray-100 rounded-md" max-width="800px">
            <v-text-field :model-value="selectedTaskId.title" maxlength="100" counter />
          </v-responsive>
        </div>
        <div class="task-details-container border rounded-3xl bg-yellow-50 p-4 m-4 shadow-md">
          <div class="task-details-left ml-4">
            <div class="itbkk-description mt-4">
              <strong>Description</strong>
              <v-responsive class="mx-auto  rounded-t-lg " max-width="5000px">
                <v-textarea class="itbkk-description resize-none bg-blue-100 " no-resize rows="18" v-if="selectedTaskId.description != null"
                  :model-value="selectedTaskId.description"  maxlength="500" counter />
                <v-textarea v-else model-value="No Description Provided" no-resize rows="20" class="resize-none" label="Task Description" maxlength="500"
                  counter  />
              </v-responsive>
            </div>
          </div>

          <div class="task-details-right flex flex-col justify-between mr-4 ">
            <div class="itbkk-assignee mt-4 mb-4 ">
              <strong>Assignees</strong>
              <v-responsive class="mx-auto rounded-t-lg" max-width="500px">
                <v-textarea class="bg-blue-100" no-resize rows="4" :model-value="selectedTaskId.assignees"  maxlength="30" counter>
                </v-textarea>
              </v-responsive>
            </div>
            <div class="itbkk-status mb-5">
              <strong>Status </strong>
              <select
                class="bg-blue-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-600">
                <option>{{ selectedTaskId.status }}</option>
                <option>To Do</option>
                <option>Doing</option>
                <option>Done</option>
              </select>
            </div>
            <div class="timeBox bg-blue-100 text-wrap box-content border rounded-lg p-4">
              <div class="itbkk-timezone m-1 ">
                <strong>Time Zone</strong>
                <v-textarea class="bg-white" no-resize rows="2" :model-value="Intl.DateTimeFormat().resolvedOptions().timeZone" 
                  ></v-textarea>
              </div>
              <div class="itbkk-created-on m-2">
                <strong>Created Date:</strong>
                {{ formatDate(selectedTaskId.createdOn) }}
              </div>
              <div class="itbkk-updated-on">
                <strong>Updated Date:</strong>
                {{ formatDate(selectedTaskId.updatedOn) }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row justify-end">
          <div class="m-4">
            <v-btn color="primary">Save</v-btn>
          </div>
          <div class="m-4 ">
            <v-btn color="primary">Cancel</v-btn>
          </div>
        </div>
        
      </div>
    </div>
  </v-form> -->
</template>

<style scoped>
/* Styles for modal and overlay */
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

/* Modal Content */
.modal-content {
  background-color: #f8f7f6;
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

/* The Close Button */
.close {
  color: #545353;
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

.task-details-container {
  display: flex;
  justify-content: space-between;
}

.task-details-left {
  width: 60%;
  /* Adjust as needed */
}

.task-details-right {
  width: 35%;
  /* Adjust as needed */
}
</style>

//อันเก่า
<!-- <v-form>
    <div v-if="Object.keys(selectedTaskId).length > 0" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2 class="font-bold text-xl text-yellow-800">Task Details</h2>
        <div class="itbkk-title">
          <v-responsive class="mx-auto" max-width="800px">
            <v-text-field
              :model-value="selectedTaskId.title"
              maxlength="100"
              label="Task Title"
              counter
            />
          </v-responsive>
        </div>
        <div class="itbkk-description">
          <v-responsive class="mx-auto" max-width="1000px">
            <v-textarea
              class="itbkk-description"
              v-if="selectedTaskId.description != null"
              :model-value="selectedTaskId.description"
              label="Task Description"
              maxlength="500"
              counter
            />
            <v-textarea
              v-else
              model-value="No Description Provided"
              label="Task Description"
              maxlength="500"
              counter
            />
          </v-responsive>
        </div>
        <div>
          <v-responsive class="mx-auto" max-width="500px">
            <v-textarea
              :model-value="selectedTaskId.assignees"
              label="Task Assignees"
              maxlength="30"
              counter
            >
            </v-textarea>
          </v-responsive>
        </div>
        <div class="itbkk-status">
          <strong>Task Status:</strong> {{ selectedTaskId.status }}
        </div>
        <div class="itbkk-timezone">
          <strong>Time Zone:</strong>
          {{ Intl.DateTimeFormat().resolvedOptions().timeZone }}
        </div>
        <div class="itbkk-created-on">
          <strong>Task Created Date:</strong>
          {{ formatDate(selectedTaskId.createdOn) }}
        </div>
        <div class="itbkk-updated-on">
          <strong>Task Updated Date:</strong>
          {{ formatDate(selectedTaskId.updatedOn) }}
        </div>
      </div>
    </div>
  </v-form> -->