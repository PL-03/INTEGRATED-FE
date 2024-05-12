<script setup>
import { ref, watch } from "vue"
import router from "@/router/router"

const props = defineProps({
  selectedStatusId: {
    type: Object,
    required: true,
  },
})
// console.log(props.selectedStatusId)
const closeModal = () => {
  router.push("/status/manage")
}
</script>

<template>
  <div v-if="Object.keys(selectedStatusId).length > 0" class="modal">
    <div class="modal-content bg-gradient-to-t from-slate-300 to-yellow-50">
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="font-bold text-xl text-yellow-950 m-2">Task Details</h2>
      <br />
      <p><strong> Title:</strong> {{ selectedStatusId.name }}</p>

      <p
        class="itbkk-description col-start-1 col-end-4 box-content h-72 border bg-yellow-100 shadow-slate-500/40 hover:shadow-blue-500/40 shadow-xl ml-16 mt-4 rounded-lg p-8 w-10/12"
      >
        <strong>Description</strong><br />
        <span v-if="selectedStatusId.description != null">{{
          selectedStatusId.description
        }}</span>
        <span v-else class="italic text-red-500">No Description Provided</span>
      </p>
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
