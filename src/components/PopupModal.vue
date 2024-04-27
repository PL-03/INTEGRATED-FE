<script setup>
import {ref} from "vue"
const props = defineProps({
  tasks: {
    type: Array,
    // required: true
  },
})
const isModalOpen = ref(false)
const closePopup = () =>{
  emit('closePopup')
}
console.log(props)
</script>

<template>
  <div class="modal">
      <div  v-for="task in selectedTaskId" :key="task.id" class="modal-content">
        <p>Task Title: {{ task.taskTitle }}</p>
        <p>Task Description: {{ task.taskDescription }}</p>
        <p>Task Assignees: {{ task.taskAssignees }}</p>
        <p>Task Status: {{ task.taskStatus }}</p>
        <p>Task Created Date: {{ task.createdOn }}</p>
        <p>Task Updated Date: {{ task.createdOn }}</p>  
      </div>
  </div>



</template>

<style scoped>
/* Styles for modal and overlay */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
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