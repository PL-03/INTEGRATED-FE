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
    <h1 class="text-5xl font-bold">IT-Bangmod Kradan Kanban</h1>
  </div>

  <div class="mt-1">
    <button
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      @click="handleAddTask"
    >
      + Add Task
    </button>
  </div>
  <div class="flex justify-center items-center mt-4">
    <table class="table-auto w-full">
      <thead class="bg-violet-200 border-b">
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
          class="font-mono bg-yellow-50 border-b itbkk-item"
          v-for="task in tasks"
          :key="tasks.indexOf(task) + 1"
        >
          <td
            class="px-6 py-4 whitespace-nowrap text-m font-medium text-gray-900 border-r"
          >
            {{ tasks.indexOf(task) + 1 }}
            <v-menu>
              <template v-slot:activator="{ props }">
                <button class="text-sm" v-bind="props">
                  <AkMoreVertical class="icon-style" />
                </button>
              </template>
              <v-list class="bg-grey-lighten-3">
                <v-list-item>
                  <v-list-item-title
                    ><button class="hover:text-white" @click="router.push("/edit")">
                      Edit
                    </button></v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title
                    ><button class="hover:text-white">
                      Delete
                    </button></v-list-item-title
                  >
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
              :style="{
                background: statusColors[getStatusText(task.status)],
              }"
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
</style>
