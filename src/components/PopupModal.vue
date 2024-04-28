<script setup>
import { ref, watch } from "vue"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

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
  return dayjs.utc(dateString).local().format("DD/MM/YYYY HH:mm:ss")
}
</script>

<template>
  <div v-if="isModalOpen" class="modal">
    <div class="modal-content">
      <span class="close" @click="isModalOpen = false">&times;</span>
      <h2>Task Details</h2>
      <p>Task Title: {{ selectedTaskId.taskTitle }}</p>
      <p>Task Description: {{ selectedTaskId.taskDescription }}</p>
      <p>Task Assignees: {{ selectedTaskId.taskAssignees }}</p>
      <p>Task Status: {{ selectedTaskId.taskStatus }}</p>
      <p>Task Created Date: {{ formatDate(selectedTaskId.createdOn) }}</p>
      <p>Task Updated Date: {{ formatDate(selectedTaskId.updatedOn) }}</p>
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
