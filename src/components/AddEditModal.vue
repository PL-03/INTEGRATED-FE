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
  selectedTaskId: {
    type: Object,
    required: true,
  },
})
const isAddingNewTask = computed(() => route.path.includes("/add"))
const isEditingTask = computed(() => route.path.includes("/edit"))

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
  <v-form name="add">
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
  <v-form name="edit" v-if="isEditingTask">
    <div v-if="Object.keys(selectedTaskId).length > 0" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
        
            <div class="itbkk-title">
              <v-responsive class="mx-auto" max-width="800px">
                <v-text-field :model-value="selectedTaskId.title" maxlength="100" label="Task Title" counter />
              </v-responsive>
            </div><div class="task-details-container">
          <div class="task-details-left">
            <div class="itbkk-description ">
              <v-responsive class="mx-auto" max-width="5000px" >
                <v-textarea class="itbkk-description" v-if="selectedTaskId.description != null"
                  :model-value="selectedTaskId.description" label="Task Description" maxlength="500" counter />
                <v-textarea v-else model-value="No Description Provided" label="Task Description" maxlength="500"
                  counter />
              </v-responsive>
            </div>
          </div>

          <div class="task-details-right flex flex-col justify-between ml-4">
            <div class="itbkk-assignee mt-2">
              <v-responsive class="mx-auto" max-width="500px">
                <v-textarea :model-value="selectedTaskId.assignees" label="Task Assignees" maxlength="30" counter>
                </v-textarea>
              </v-responsive>
            </div>
            <div class="itbkk-status mb-5">
              <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                <strong>Task Status: </strong>
              </label> 
              <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                <option>{{ selectedTaskId.status }}</option>
                <option>To Do</option>
                <option>Doing</option>
                <option>Done</option>
              </select>
            </div>
            <div class="timeBox text-wrap box-content border rounded p-4">
            <div class="itbkk-timezone m-2">
              <strong>Time Zone:</strong> 
              <v-textarea :model-value="Intl.DateTimeFormat().resolvedOptions().timeZone" class="w-full h-auto" label="Task TimeZone"></v-textarea>
            </div>
            <div class="itbkk-created-on m-2">
              <strong>Task Created Date:</strong> 
              <div class="box2 box-content border rounded-full">{{ formatDate(selectedTaskId.createdOn) }}</div>
            </div>
            <div class="itbkk-updated-on">
              <strong>Task Updated Date:</strong> 
              <div class="box3 box-content border rounded-full">{{ formatDate(selectedTaskId.updatedOn) }}</div>
            </div></div></div>
          </div>

            <div class="button place-content-center box-content h-12 w-24 border-auto bg-cyan-50 shadow-md ml-5 rounded-full px-3 py-1">
              <button><strong>Save</strong></button>
            </div>
          
        
      </div>
    </div>
  </v-form>
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

/* The Close Button */
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
</style>
