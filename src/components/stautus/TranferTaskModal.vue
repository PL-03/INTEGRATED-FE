<script setup>
import { ref, computed } from "vue"

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  statusName: {
    type: String,
    required: true,
  },
  statuses: {
    type: Array,
    required: true,
  },
  statusId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(["close", "confirm", "transfer"])

const newStatusId = ref(null)

const filteredStatuses = computed(() => {
  return props.statuses.filter((status) => status.id !== props.statusId)
})

const closeModal = () => {
  emit("close")
  newStatusId.value = null
}

const confirmTransfer = () => {
  console.log(newStatusId.value)
  emit("transfer", newStatusId.value)
  closeModal()
}
</script>
<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="font-bold text-xl text-yellow-950">Transfer Tasks</h2>
      <p class="itbkk-message">
        There are tasks currently assigned to the "{{ statusName }}" status.
        Please select a new status to transfer these tasks before deleting the
        current status.
      </p>
      <div class="itbkk-status mt-2 text-start">
        <strong class="text-gray-500 text-sm ml-4">New Status</strong>
        <select
          v-model="newStatusId"
          class="shadow-md bg-blue-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option
            v-for="status in filteredStatuses"
            :key="status.id"
            :value="status.id"
          >
            {{ status.name }}
          </option>
        </select>
      </div>
      <div class="flex flex-row justify-center itbkk-button-action">
        <div class="m-4">
          <button
            class="bg-green-500 text-white font-bold py-2 px-4 rounded itbkk-button-confirm"
            @click="confirmTransfer"
          >
            Transfer
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
