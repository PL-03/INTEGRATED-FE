<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  taskTitle: {
    type: String,
    required: true,
  },
  isStatus: {
    type: Boolean,
    default: false,
  },
  statuses: {
    type: Array,
    required: true,
  },
  tasksAssociated: {
    type: Boolean,
    default: false,
  },
  associatedTasksCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["close", "confirm", "transfer"]);

const closeModal = () => {
  emit("close");
};

const confirmDelete = () => {
  if (props.tasksAssociated) {
    emit("transfer", transferStatus.value.id);
  } else {
    emit("confirm");
  }
};

const modalTitle = computed(() => {
  return props.tasksAssociated
    ? "Transfer Tasks"
    : props.isStatus
    ? "Delete Status"
    : "Delete Task";
});

const modalMessage = computed(() => {
  if (props.tasksAssociated) {
    return `There are ${props.associatedTasksCount} tasks associated with the "${props.taskTitle}". Transfer to:`;
  } else if (props.isStatus) {
    return `Do you want to delete the status "${props.taskTitle}"?`;
  } else {
    return `Do you want to delete the task "${props.taskTitle}"?`;
  }
});

const transferStatus = ref(null);

const filteredStatuses = computed(() => {
  return props.statuses.filter(
    (status) =>
      status.id !== props.statuses.find((s) => s.name === props.taskTitle).id
  );
});
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="font-bold text-xl text-yellow-950">{{ modalTitle }}</h2>
      <p class="itbkk-message">{{ modalMessage }}</p>
      <div v-if="tasksAssociated" class="mt-4">
        <select
          id="transfer-status"
          v-model="transferStatus"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option
            v-for="status in filteredStatuses"
            :key="status.id"
            :value="status"
          >
            {{ status.name }}
          </option>
        </select>
      </div>
      <div class="flex flex-row justify-center itbkk-button-action mt-4">
        <div class="m-4">
          <button
            class="bg-green-500 text-white font-bold py-2 px-4 rounded itbkk-button-confirm"
            @click="confirmDelete"
            :disabled="tasksAssociated && !transferStatus"
          >
            {{ tasksAssociated ? "Transfer" : "Save" }}
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
