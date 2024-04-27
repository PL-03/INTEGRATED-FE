<script setup>
const props = defineProps({
  tasks: {
    type: Array,
    // required: true
  },
})
</script>

<template>
<slot name="TaskDetail">
  <template v-for="task in tasks" :key="task.id">
    <div class="itbkk-item">
      <div class="itbkk-title">{{ task.taskTitle }}</div>
      <div class="itbkk-description"><input type="text" value=""></div>
    </div>
  </template>
</slot>
</template>

<style scoped></style>
