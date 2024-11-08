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
  showConfirmationModal: {
    type: Boolean,
    default: false,
  },
  showChangePermission: {
    type: Boolean,
    default: false,
  },
  collabDetail: {
    type: Object,
  },
  permissionToChange: {
    type: String,
    required: true,
  },
  showDeleteModal: {
    type: Boolean,
  },
  boardDetail: {
    type: Object,
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
const confirmPermissionChange = () => {
  emit("confirmPermissionChange");
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
    <div class="modal-content font-lilita">
      <button class="close hover:text-red-500" @click="closeModal">
        &times;
      </button>
      <h2 class="text-xl text-yellow-950">{{ modalTitle }}</h2>
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
        <div class="mt-4">
          <button
            class="bg-green-500 text-white w-20 h-10 rounded itbkk-button-confirm"
            @click="confirmDelete"
            :disabled="tasksAssociated && !transferStatus"
          >
            {{ tasksAssociated ? "Transfer" : "OK" }}
          </button>
        </div>
        <div class="m-4">
          <button
            class="bg-red-500 text-white py-2 px-4 rounded itbkk-button-cancel"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showConfirmationModal" class="modal-overlay">
    <div class="modal-content font-lilita">
      <!-- <button class="close hover:text-red-500" @click="closeModal">
        &times;
      </button> -->
      <h2 class="text-xl text-yellow-900">Remove Collaborator</h2>
      <hr class="divider">
      <p class="itbkk-message text-left">
        Do you want to remove " {{ collabDetail.name }} " from the board?
      </p>
      <div class="flex flex-row justify-end itbkk-button-action mt-4">
        <div class="mt-2 mr-2">
          <button
            class="bg-[#3cc55e] hover:bg-[#319c5e] text-white w-20 h-10 rounded itbkk-button-confirm"
            @click="confirmDelete"
          >
            Confirm
          </button>
        </div>
        <div class="mt-2">
          <button
            class="bg-red-500 hover:bg-[#c03a3a] text-white  w-20 h-10 rounded itbkk-button-cancel"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showChangePermission" class="modal-overlay">
    <div class="modal-content font-lilita">
      <!-- <button class="close hover:text-red-500" @click="closeModal">
        &times;
      </button> -->
      <h2 class="text-xl text-yellow-900">Change Access Right</h2>
       <hr class="divider">
      <p class="itbkk-message text-left">
        Do you want to change access right " {{ collabDetail.name }} " to 
        " {{ permissionToChange }} " ?
      </p>
      <div class="flex flex-row justify-end itbkk-button-action mt-4">
        <div class="mt-2 mr-2">
          <button
            class="bg-[#3cc55e] hover:bg-[#319c5e] text-white w-20 h-10 rounded itbkk-button-confirm"
            @click="confirmDelete"
          >
            Confirm
          </button>
        </div>
        <div class="mt-2">
          <button
            class="bg-red-500 hover:bg-[#c03a3a] text-white  w-20 h-10 rounded itbkk-button-cancel"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showDeleteModal" class="modal-overlay">
    <div class="modal-content font-lilita">
      <!-- <button class="close hover:text-red-500" @click="closeModal">
        &times;
      </button> -->
      <h2 class="text-xl text-yellow-900">Leave Board</h2>
      <hr class="divider">
      <p class="itbkk-message text-left">
        Do you want to leave this " {{ boardDetail.name }} " board?
      </p>
      <div class="flex flex-row justify-end itbkk-button-action mt-8">
        <div class="mt-2 mr-2">
          <button
            class="bg-[#3cc55e] hover:bg-[#319c5e] text-white w-20 h-10 rounded itbkk-button-confirm"
            @click="confirmDelete"
          >
            Confirm
          </button>
        </div>
        <div class="mt-2">
          <button
            class="bg-red-500 hover:bg-[#c03a3a] text-white  w-20 h-10 rounded itbkk-button-cancel"
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
.divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 10px 0;
}

</style>
