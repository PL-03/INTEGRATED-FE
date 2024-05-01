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

watch(
  () => props.selectedTaskId,
  (newValue) => {
    if (Object.keys(newValue).length > 0) {
      isModalOpen.value = true
    } else {
      isModalOpen.value = false
    }
  }
)

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
      <h2 class="font-bold text-xl text-yellow-950">Task Details</h2><br>
      <p><strong> Title:</strong> {{ selectedTaskId.title }}</p>

      <p class="itbkk-description box-content h-52 w-auto border bg-white shadow-blue-500/40 hover:shadow-indigo-500/40 shadow-xl my-8 rounded-lg px-4 py-2 w-full ">
        <strong>Task Description: </strong><br>
        <span v-if="selectedTaskId.description != null">{{
          selectedTaskId.description
        }}</span>
        <span v-else class="italic text-red-500">No Description Provided</span>
      </p>
      <div class="grid grid-cols-4 m-4">
      <p class="col-start-1 col-end-2 break-words place-content-center box-content h-32 w-96 p-4 border bg-white shadow-md ml-15 rounded-3xl  px-4 py-2" ><strong>Task Assignees:</strong><br> {{ selectedTaskId.assignees }}</p>

      <p class="itbkk-status col-start-3 col-end-4 box-content place-content-center h-32 w-96 p-4 border bg-white shadow-md mx-4 rounded-3xl px-4 py-2">
        <strong>Task Status: </strong><br> {{ selectedTaskId.status }}
      </p>
      </div>

      <div class="grid grid-cols-6  ">
      <p class="itbkk-timezone col-start-1 col-end-2 place-content-center box-content h-24 w-72 p-4 border bg-white shadow-xl ml-5 rounded-l-3xl px-4 py-2  ">
        <strong>Time Zone: </strong><br>
        {{ Intl.DateTimeFormat().resolvedOptions().timeZone }}
      </p>

      <p class="itbkk-created-on col-start-3 col-end-4 place-content-center box-content h-24 w-72 p-4 border bg-white shadow-xl ml-5 mr-5 rounded px-4 py-2">
        <strong>Task Created Date: </strong><br>
        {{ formatDate(selectedTaskId.createdOn) }}
      </p>

      <p class="itbkk-updated-on col-start-5 col-end-6 place-content-center box-content h-24 w-72 p-4 border bg-white shadow-xl ml-5 rounded-r-3xl px-4 py-2">
        <strong>Task Updated Date: </strong><br>
        {{ formatDate(selectedTaskId.updatedOn) }}
      </p>
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
  background-color: #ddd6fe;
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
</style>
