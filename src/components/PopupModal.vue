<script setup>
import router from "@/router/router"

const props = defineProps({
  selectedTaskId: {
    type: Object,
    required: true,
  },
})

const formatDate = (dateString) => {
  if (!dateString) return "Date is undefined"

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hourCycle: "h24",
  }
  const utcDate = new Date(dateString)
  const formatter = new Intl.DateTimeFormat("en-GB", options)
  const formattedDate = formatter.format(utcDate)
  return formattedDate
}

const closeModal = () => {
  router.push("/task")
}
</script>

<template>
  <div v-if="Object.keys(selectedTaskId).length > 0" class="modal">
    <div
      class="modal-content bg-gradient-to-t from-slate-300 to-yellow-50 w-full"
    >
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="font-bold text-xl text-yellow-950 m-2">Task Details</h2>
      <br />
      <p class="break-words">
        <strong> Title:</strong> {{ selectedTaskId.title }}
      </p>

      <div class="flex mt-2 justify-center">
        <p
          class="itbkk-description box-content border bg-yellow-100 shadow-slate-500/40 hover:shadow-blue-500/40 shadow-xl mr-5 mt-4 rounded-lg p-8 h-80 w-6/12"
        >
          <strong>Description</strong><br />
          <span v-if="selectedTaskId.description != null">{{
            selectedTaskId.description
          }}</span>
          <span v-else class="italic text-red-500"
            >No Description Provided</span
          >
        </p>

        <div class="mr-10 pl-4">
          <div class="flex">
            <div class="mr-2">
              <p
                class="itbkk-assignees break-words place-content-center box-content h-32 w-40 mt-4 border bg-yellow-100 shadow-lg rounded-3xl px-4 py-2"
              >
                <strong>Assignees</strong><br />
                <span v-if="selectedTaskId.assignees != null">{{
                  selectedTaskId.assignees
                }}</span>
                <span v-else class="italic text-gray-900">Unassigned</span>
              </p>
            </div>

            <div>
              <p
                class="itbkk-status place-content-center box-content h-32 w-full mt-4 border bg-yellow-100 drop-shadow-lg rounded-3xl px-8 py-2"
              >
                <strong>Status</strong><br />
                {{ selectedTaskId.status.name }}
              </p>
            </div>
          </div>

          <div class="col-span-8 mt-4 ml-8">
            <p
              class="itbkk-timezone place-content-center box-content h-10 w-full border bg-blue-200 shadow-md mb-3 mt-4 mr-2 rounded-full px-2 py-3"
            >
              <strong>Time Zone</strong><br />
              {{ Intl.DateTimeFormat().resolvedOptions().timeZone }}
            </p>

            <p
              class="itbkk-created-on place-content-center box-content h-10 w-full border bg-sky-200 shadow-md mb-3 mr-2 rounded-full px-2 py-3"
            >
              <strong>Created Date</strong><br />
              {{ formatDate(selectedTaskId.createdOn) }}
            </p>

            <p
              class="itbkk-updated-on place-content-center box-content h-10 w-full border bg-cyan-100 shadow-md mr-2 rounded-full px-2 py-3"
            >
              <strong>Updated Date</strong><br />
              {{ formatDate(selectedTaskId.updatedOn) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

/* Modal Content */
.modal-content {
  background-color: #f8f7f6;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-height: 80vh;
  overflow-y: auto;
}

.itbkk-description span {
  word-wrap: break-word;
}

/* The Close Button */
.close {
  color: #545353;
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

.task-details-container {
  display: flex;
  justify-content: space-between;
}

.task-details-left {
  width: 60%;
}

.task-details-right {
  width: 35%;
  /* Adjust as needed */
}
</style>
