<script setup>
import { ref, onMounted } from 'vue';
import TaskTable from './components/TaskTable.vue';
import { getTask } from './components/Utils/fetchUtil';
import PopupModal from './components/PopupModal.vue';


const tasks = ref([]);
const selectedTaskId = ref([]); 

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/itb-kk/v1/tasks`);
  const data = await response.json();
  tasks.value = data;

});

// Function to handle task click and fetch details (emitted from TaskTable)
const handleTaskClick = async (taskId) => {
  const taskDetails = await fetch(`${import.meta.env.VITE_BASE_URL}/itb-kk/v1/tasks/${taskId}`);
  const data = await taskDetails.json();
  selectedTaskId.value = data;
//  console.log(selectedTaskId.value);
};

const toggleShowPopup = () => {
  showPopup.value =!showPopup.value;
}
</script>

<template>
  <TaskTable :tasks="tasks" @task-clicked="handleTaskClick"/>
  <PopupModal :selectedTaskId="selectedTaskId" />
</template>

<style scoped></style>