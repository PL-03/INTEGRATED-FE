<script setup>
import { ref } from "vue"

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  taskTitle: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(["close", "confirm"])

const closeModal = () => {
  emit("close")
}

const confirmDelete = () => {
  emit("confirm")
}
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="font-bold text-xl text-yellow-950">Delete Task</h2>
      <p class="itbkk-message">
        Do you want to delete the task "{{ taskTitle }}"?
      </p>
      <div class="flex flex-row justify-end">
        <div class="m-4">
          <button
            class="bg-green-500 text-white font-bold py-2 px-4 rounded itbkk-button-confirm"
            @click="confirmDelete"
          >
            Confirm
          </button>
        </div>
        <div class="m-4">
          <button
            class="bg-red-500 text-white font-bold py-2 px-4 rounded itbkk-button-cancel"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
