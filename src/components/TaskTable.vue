<script setup>
import router from "@/router/router"
import { ref, watch } from "vue"
import { AkMoreVertical } from "@kalimahapps/vue-icons"

const props = defineProps({
  tasks: {
    type: Array,
    // required: true
  },
})

const statusColors = {
  "No Status": "#ccc",
  "To Do": "#f9c74f",
  Doing: "#007bff",
  Done: "#28a745",
}
console.log(props)
</script>

<template>
  <div>
    <h1 class="text-5xl font-bold">IT-Bangmod Kradan Kanban</h1>
  </div>

  <div class="mt-1">
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
          :key="tasks.indexOf(task) + 1"
        >
          <td
            class="px-6 py-4 whitespace-nowrap text-m font-medium text-gray-900 border-r"
          >
            {{ tasks.indexOf(task) + 1 }}
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon :color="'grey-lighten-3'" v-bind="props"
                  ><AkMoreVertical class="icon-style"
                /></v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </td>
          <td
            class="text-m text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r itbkk-title"
          >
            <button @click="$router.push(`/task/${task.id}`)">
              {{ task.title }}
            </button>
          </td>
          <td>
            <span
              v-if="task.assignees"
              class="text-m text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r itbkk-assignees"
            >
              {{ task.assignees }}
            </span>
            <span
              v-else
              class="text-m text-gray-500 border-r italic itbkk-assignees"
            >
              Unassigned
            </span>
          </td>
          <td
            class="text-m text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r itbkk-status"
          >
            <button
              class="font-bold py-2 px-4 rounded"
              :style="{ background: statusColors[task.status] }"
            >
              {{ task.status }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.color-style {
  font-size: 1.3em;
}
border-r {
  border-right: 1px solid #e2e8f0;
}
</style>
