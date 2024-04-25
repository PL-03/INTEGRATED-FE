<script setup>
import { onMounted } from 'vue';
import {getTask} from './Utils/fetchUtil.js'
import TaskTable from './TaskTable.vue'

onMounted(async () => {
//   const items = await getTask(`${import.meta.env.VITE_BASE_URL}/itb-kk/v1/tasks`)
})
</script>

<template>
<TaskTable />
</template>

<style scoped></style>
