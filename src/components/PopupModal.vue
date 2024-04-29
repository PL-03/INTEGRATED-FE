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
    // Add additional options here
    hourCycle: "h24", // Use 24-hour format (0-23)
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
      <h2>Task Details</h2>
      <p>Task Title: {{ selectedTaskId.taskTitle }}</p>
      <p class="itbkk-description">
        Task Description: {{ selectedTaskId.taskDescription }}
      </p>
      <p>Task Assignees: {{ selectedTaskId.taskAssignees }}</p>
      <p class="itbkk-status">Task Status: {{ selectedTaskId.taskStatus }}</p>
      <p class="itbkk-timezone">
        Time Zone: {{ Intl.DateTimeFormat().resolvedOptions().timeZone }}
      </p>
      <p class="itbkk-created-on">
        Task Created Date: {{ formatDate(selectedTaskId.createdOn) }}
      </p>
      <p class="itbkk-updated-on">
        Task Updated Date: {{ formatDate(selectedTaskId.updatedOn) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Styles for modal and overlay */
.modal {
  display: block; /* Show the modal */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
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
