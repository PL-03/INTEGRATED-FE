<script setup>
import { ref, watch } from "vue"
import router from "@/router/router"
import { convertToTitleCase } from "../libs/util.js"

const props = defineProps({
  selectedTaskId: {
    type: Object,
    required: true,
  },
})

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
          class="itbkk-assignees col-start-1 col-end-2 break-words place-content-center box-content h-56 w-52 p-4 border bg-amber-50 shadow-lg my-4 mr-12 rounded-3xl px-4 py-2"
        >
          <strong>Task Assignees:</strong><br />
          <span v-if="selectedTaskId.assignees != null">{{
            selectedTaskId.assignees
          }}</span>
          <span v-else class="italic text-gray-900">Unassigned</span>
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
}

.task-details-right {
  width: 35%;
  /* Adjust as needed */
}
</style>
