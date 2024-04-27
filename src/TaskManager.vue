<script setup>
import { ref, onMounted } from 'vue';
import TaskTable from './components/TaskTable.vue';
import { getTask } from './components/Utils/fetchUtil';

const tasks = ref([]);

// onMounted(async () => {
// tasks.value = getTask(`${import.meta.env.VITE_BASE_URL}/itb-kk/v1/tasks`)
// console.log(tasks);
// })

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/itb-kk/v1/tasks`);
  const data = await response.json();
  tasks.value = data;
})

</script>

<template>
  <TaskTable :tasks="tasks" />
</template>

<style scoped></style>