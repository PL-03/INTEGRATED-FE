<script setup>

const props = defineProps({
  tasks: {
    type: Array,
    // required: true
  }
})
</script>
 
<template>
<div v-for="task in tasks" :key="task.id">
    <div>{{ task.taskTitle }}</div>
    <v-textarea>{{task.tastDescription}}</v-textarea>
</div>
</template>
 
<style scoped>

</style>