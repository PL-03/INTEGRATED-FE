<script setup>
import { ref } from "vue";
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  boardVisible: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["confirm", "close"]);

const confirm = () => {
  emit("confirm");
};

const close = () => {
  emit("close");
};
</script>

<template>
  <div
    v-if="show"
    class="modal fixed inset-0 z-50 flex items-center justify-center"
    @click="close"
  >
    <div class="itbkk-modal-alert bg-white rounded-lg shadow-2xl p-4 w-1/3">
      <h3 class="text-xl mb-4 text-center text-[#674d3f] pl-2">Change Board Visibility</h3>
      <hr class="divider" />
      <p
        v-if="boardVisible === 'PRIVATE'"
        class="itbkk-message mb-6 text-gray-700 text-start p-2"
      >
        In public, anyone can view the board, task list and task detail of tasks
        in the board. Do you want to change the visibility to <span class="font-bold text-[#2d3fb0] tracking-wider">Public</span>?
      </p>
      <p v-else class="itbkk-message mb-6 text-gray-700 text-start p-2">
        In private, only board owner can access/control board, task list. Do you
        want to change the visibility to <span class="font-bold text-[#2d3fb0] tracking-wider">Private</span>?
      </p>
      <div class="flex justify-end space-x-2">
        <button
          class="itbkk-button-confirm bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded"
          @click="confirm"
        >
          Confirm
        </button>
        <button
          class="itbkk-button-cancel bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded"
          @click="close"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  /* display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.5); */
  backdrop-filter: blur(2px);
}

.itbkk-modal-alert {
  background-color: #ffffff;
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
}

.divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 10px 0;
}
</style>
