<script setup>
import { ref, watch } from "vue"
import router from "@/router/router"

const props = defineProps({
  selectedTaskId: {
    type: Object,
    required: true,
  },
})

const isModalOpen = ref(false)

watch(
  () => props.selectedTaskId,
  (newValue) => {
    if (Object.keys(newValue).length > 0) {
      isModalOpen.value = true
    } else {
      isModalOpen.value = false
    }
  }
)

const formatDate = (dateString) => {
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
  <v-form>
    <div v-if="Object.keys(selectedTaskId).length > 0" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2 class="font-bold text-xl text-yellow-800">Task Details</h2>
        <div class="itbkk-title">
          <v-responsive class="mx-auto" max-width="800px">
            <v-text-field
              :model-value="selectedTaskId.title"
              maxlength="100"
              label="Task Title"
              counter
            />
          </v-responsive>
        </div>
        <div class="itbkk-description">
          <v-responsive class="mx-auto" max-width="1000px">
            <v-textarea
              class="itbkk-description"
              v-if="selectedTaskId.description != null"
              :model-value="selectedTaskId.description"
              label="Task Description"
              maxlength="500"
              counter
            />
            <v-textarea
              v-else
              model-value="No Description Provided"
              label="Task Description"
              maxlength="500"
              counter
            />
          </v-responsive>
        </div>
        <div>
          <v-responsive class="mx-auto" max-width="500px">
            <v-textarea
              :model-value="selectedTaskId.assignees"
              label="Task Assignees"
              maxlength="30"
              counter
            >
            </v-textarea>
          </v-responsive>
        </div>
        <div class="itbkk-status">
          <strong>Task Status:</strong> {{ selectedTaskId.status }}
        </div>
        <div class="itbkk-timezone">
          <strong>Time Zone:</strong>
          {{ Intl.DateTimeFormat().resolvedOptions().timeZone }}
        </div>
        <div class="itbkk-created-on">
          <strong>Task Created Date:</strong>
          {{ formatDate(selectedTaskId.createdOn) }}
        </div>
        <div class="itbkk-updated-on">
          <strong>Task Updated Date:</strong>
          {{ formatDate(selectedTaskId.updatedOn) }}
        </div>
      </div>
    </div>
  </v-form>
</template>

<style scoped>
/* Styles for modal and overlay */
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
  background-color: #fefefe;
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
  color: #aaaaaa;
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
</style>