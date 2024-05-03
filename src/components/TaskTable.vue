<script setup>
import router from "@/router/router"
import { ref, watch } from "vue"
import { AkMoreVertical } from "@kalimahapps/vue-icons"
import { convertToTitleCase } from "../libs/util.js"
import { nextTick } from "vue"
const props = defineProps({
  tasks: {
    type: Array,
    // required: true
  },
})
const option = ["Edit", "Delete"]

const statusColors = {
  "No Status": "#9ca3af",
  "To Do": "#ffd1d1",
  Doing: "#fde047",
  Done: "#5cd052",
}
const getStatusText = (status) => {
  return convertToTitleCase(status) || status
}
const handleAddTask = () => {
  router.push({ name: "taskadd" })
}
console.log(props)
</script>

<template>
  <div>
    <h1 class="text-5xl font-bold mt-6">IT-Bangmod Kradan Kanban</h1>
  </div>

  <div class="mt-4 flex justify-center items-center">
    <button
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      @click="handleAddTask"
    >
      + Add Task
    </button>
  </div>

  <div class="mt-4 flex justify-center items-center">
    <table class="table-auto w-9/12 m-4 ">
      <thead class="bg-violet-200 border-b py-4">
        <tr>
          <th class="text-lg font-medium text-gray-900 px-4 py-2 text-left border-r">
            #
          </th>
          <th class="text-lg font-medium text-gray-900 px-4 py-2 text-left border-r">
            Title
          </th>
          <th class="text-lg font-medium text-gray-900 px-4 py-2 text-left border-r">
            Assignees
          </th>
          <th class="text-lg font-medium text-gray-900 px-4 py-2 text-left">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="font-mono bg-yellow-50 border-b itbkk-item"
          v-for="(task, index) in tasks"
          :key="task.id"
        >
          <td class="px-4 py-2 whitespace-nowrap text-m font-medium text-gray-900 border-r">
            {{ index + 1 }}
            <v-menu>
              <template v-slot:activator="{ props }">
                <button class="text-sm" v-bind="props">
                  <AkMoreVertical class="icon-style" />
                </button>
              </template>
              <v-list class="bg-grey-lighten-3">
                <v-list-item>
                  <v-list-item-title>
                    <button class="hover:text-white">Edit</button>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <button class="hover:text-white">Delete</button>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </td>
          <td class="break-all text-m text-gray-900 font-light px-4 py-2 whitespace-normal border-r itbkk-title">
            <button  @click="$router.push(`/task/${task.id}`)">
              {{ task.title }}
            </button>
          </td>
          <td class="break-all text-m text-gray-900 font-light px-4 py-2 whitespace-normal border-r itbkk-assignees">
            <span
              v-if="task.assignees"
            >
              {{ task.assignees }}
            </span>
            <span v-else class="italic text-gray-500">Unassigned</span>
          </td>
          <td class="text-m text-gray-900 font-light px-4 py-2 whitespace-normal itbkk-status">
            <button
              class="status font-bold py-2 px-4 rounded"
              :style="{ background: statusColors[getStatusText(task.status)] }"
            >
              {{ getStatusText(task.status) }}
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
.status {
  width: 120px;
}
</style>
