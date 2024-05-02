<script setup>
import { ref, watch } from "vue"
import router from "@/router/router"

const props = defineProps({
  selectedTaskId: {
    type: Object,
    required: true,
  },
})

const isModalOpen = ref(false)

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
  <div v-if="Object.keys(selectedTaskId).length > 0" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="font-bold text-xl text-yellow-950">Task Details</h2>
      <br />
      <p><strong> Title:</strong> {{ selectedTaskId.title }}</p>

      <p
        class="itbkk-description col-start-1 col-end-4 box-content h-72 w-auto border bg-amber-50 shadow-slate-500/40 hover:shadow-blue-500/40 shadow-xl mx-8 my-8 rounded-lg px-4 py-2 w-full"
      >
        <strong>Task Description: </strong><br />
        <span v-if="selectedTaskId.description != null">{{
          selectedTaskId.description
        }}</span>
        <span v-else class="italic text-red-500">No Description Provided</span>
      </p>
      <div class="grid grid-cols-8 rows-2 m-8">
        <p
          class="col-start-1 col-end-2 break-words place-content-center box-content h-56 w-52 p-4 border bg-amber-50 shadow-lg my-4 mr-12 rounded-3xl px-4 py-2"
        >
          <strong>Task Assignees:</strong><br />
          {{ selectedTaskId.assignees }}
        </p>

        <p
          class="itbkk-status col-start-3 box-content place-content-center h-56 w-52 p-4 border bg-amber-50 drop-shadow-lg my-4 ml-6 rounded-3xl px-4 py-2"
        >
          <strong>Task Status: </strong><br />
          {{ selectedTaskId.status }}
        </p>

        <div class="row-span-2 col-start-5 mt-2 ml-8 gap-5">
          <p
            class="itbkk-timezone place-content-center box-content h-14 w-96 p-4 border bg-blue-100 shadow-md mb-3 mt-1 ml-5 rounded-full px-4 py-2"
          >
            <strong>Time Zone: </strong><br />
            {{ Intl.DateTimeFormat().resolvedOptions().timeZone }}
          </p>

          <p
            class="itbkk-created-on place-content-center box-content h-14 w-96 p-4 border bg-sky-100 shadow-md mb-3 ml-5 mr-5 rounded-full px-4 py-2"
          >
            <strong>Task Created Date: </strong><br />
            {{ formatDate(selectedTaskId.createdOn) }}
          </p>

          <p
            class="itbkk-updated-on place-content-center box-content h-14 w-96 p-4 border bg-cyan-50 shadow-md ml-5 rounded-full px-4 py-2"
          >
            <strong>Task Updated Date: </strong><br />
            {{ formatDate(selectedTaskId.updatedOn) }}
          </p>
        </div>
      </div>
    </div>
  </div>
  
  
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

/* .all-task {
  display: grid ;
} */

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


<!-- <v-form>
    <div v-if="Object.keys(selectedTaskId).length > 0" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
        <h2 class="font-bold text-xl text-yellow-950 m-4">Task Details</h2>

        
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
  </v-form> -->