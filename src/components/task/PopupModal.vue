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
  router.push({ name: "tasklist" })
}
</script>

<template>
  <div v-if="Object.keys(selectedTaskId).length > 0" class="modal">
    <div
      class="modal-content bg-gradient-to-t from-[#eff1da] to-[#ddedfc] font-lilita"
    >
      <span class="close" @click="closeModal">&times;</span>
      <p class="text-2xl text-[#675757]">Task Details</p>
      <br />
      <p class="break-words text-lg">
        <span class="mr-2"> Title:</span> {{ selectedTaskId.title }}
      </p>

      <div class="flex justify-center">
        <span
          class="itbkk-description bg-white shadow-slate-500/40 shadow-md mx-4 mt-2 w-6/12 rounded-lg p-6"
        >
          <span>Description</span><br />
          <div class="bg-[#536285] rounded-md w-96 h-36 p-4">
            <span
              v-if="selectedTaskId.description != null"
              class="text-white"
              >{{ selectedTaskId.description }}</span
            >
            <span v-else class="italic text-red-500"
              >No Description Provided</span
            >
          </div>

          <div class="flex">
            <div class="mr-4">
              <div class="itbkk-assignees">
                <span>Assignees</span><br />
                <div class="bg-[#536285] text-sm p-2 rounded-md w-48 h-16">
                  <span
                    v-if="selectedTaskId.assignees != null"
                    class="text-white"
                  >
                    {{ selectedTaskId.assignees }}
                  </span>
                  <span v-else class="italic text-gray-900">Unassigned</span>
                </div>
              </div>

              <div>
                <div class="itbkk-status">
                  <span>Status</span><br />
                  <div
                    class="text-white bg-[#536285] text-sm p-2 rounded-md w-48 h-16"
                  >
                    {{ selectedTaskId.status }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 bg-[#536285] w-52 p-2 rounded tracking-wide">
              <p class="itbkk-timezone">
                <span>Time Zone</span><br />
                <span class="text-white text-sm">{{
                  Intl.DateTimeFormat().resolvedOptions().timeZone
                }}</span>
              </p>

              <p class="itbkk-created-on">
                <span>Created Date</span><br />
                <span class="text-white text-sm">
                  {{ formatDate(selectedTaskId.createdOn) }}</span
                >
              </p>

              <p class="itbkk-updated-on">
                <span>Updated Date</span><br />
                <span class="text-white text-sm">{{
                  formatDate(selectedTaskId.updatedOn)
                }}</span>
              </p>
            </div>
          </div>
        </span>
        <span
          class="flex justify-center text-md w-80 mt-2 mr-8 bg-white shadow-lg text-black rounded-md font-lilita p-4 tracking-wide"
        >
          <ul class="max-h-80 overflow-y-scroll mx-2 my-4">
            <!-- <li
              class="file bg-[#3b476d] w-56 h-14 m-2 rounded-md text-white flex justify-center items-center tracking-wider"
            >
              <img src="../../assets/filePic.png" class="w-8 h-8 mr-2" />
              filename1.pdf
            </li> -->
            <li>
              <div class="flex flex-wrap gap-4 justify-center p-4">
                <div
                  class="relative w-40 h-40 bg-gray-100 shadow-md rounded-md overflow-hidden"
                >
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Thumbnail Image"
                    class="object-cover w-full h-full"
                  />
                  <div
                    class="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm text-center py-1"
                  >
                    filename.pdf
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
ul::-webkit-scrollbar {
  width: 8px;
}
ul::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}
ul::-webkit-scrollbar-thumb {
  background: #2c62ea;
  border-radius: 8px;
}
ul::-webkit-scrollbar-thumb:hover {
  background: #1c4ab8;
}

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
  width: 60%;
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
  color: #9f0909;
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
