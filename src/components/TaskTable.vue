<script setup>
import router from "@/router/router"
import { defineEmits,ref, watch } from "vue"
import PopupModal from "./PopupModal.vue";

const showPopup = ref(false)
const props = defineProps({
  tasks: {
    type: Array,
    // required: true
  },
})

const statusColors = {
  "No Status": "#ccc", // Light gray for neutral state
  Todo: "#f9c74f", // Orange for pending tasks
  Doing: "#007bff", // Blue for in-progress tasks
  Done: "#28a745", // Green for completed tasks
}

</script>

<template>
  <div>
    <h1 class="text-5xl font-bold">IT-Bangmod Kradan Kanban</h1>
  </div>
  <div class="mt-4">
    <button
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >
      + Add Task
    </button>
  </div>
  <div class="flex justify-center items-center mt-4">
    <table class="table-auto w-full">
      <thead class="bg-white border-b">
        <tr>
          <th
            scope="col"
            class="text-lg font-medium text-gray-900 px-6 py-2 text-left border-r"
          >
            #
          </th>
          <th
            scope="col"
            class="text-lg font-medium text-gray-900 px-6 py-2 text-left border-r"
          >
            Title
          </th>
          <th
            scope="col"
            class="text-lg font-medium text-gray-900 px-6 py-2 text-left border-r"
          >
            Assignees
          </th>
          <th
            scope="col"
            class="text-lg font-medium text-gray-900 px-6 py-2 text-left"
          >
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="font-mono bg-gray-100 border-b itbkk-item"
          v-for="task in tasks"
          :key="task.id"
          @click="$emit('task-clicked', task.id)"
          data-task-id="{{ task.id }}"
        >
          <td
            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r"
          >
            {{ task.id }}
          </td>
          <td
            class="text-m text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r itbkk-title"
          >
           <button >{{ task.taskTitle }}</button> 
          </td>
          <td>
            <span
              v-if="task.taskAssignees"
              class="text-m text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r itbkk-assignees"
            >
              {{ task.taskAssignees }}
            </span>
            <span
              v-else
              class="text-m text-gray-500 font-style: italic itbkk-assignees"
            >
              Unassigned
            </span>
          </td>
          <td
            class="text-m text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r itbkk-status"
          >
            <button
              class="font-bold py-2 px-4 rounded"
              :style="{ background: statusColors[task.taskStatus] }"
            >
              {{ task.taskStatus }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
border-r {
  border-right: 1px solid #e2e8f0;
}
</style>
<!-- <router-link :to="{ path:`/v1/task/${task.id}` }" class="text-cyan-500 hover:text-cyan-700"></router-link> -->
