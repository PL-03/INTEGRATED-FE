<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getToken, useRefreshToken } from "@/services/tokenService";

// Define props to control modal visibility
const props = defineProps({ showModal: { type: Boolean, required: true } });
const emits = defineEmits(["update:showModal"]);
const route = useRoute();
const textInput = ref("");
const selectedOption = ref("read");
const boardId = route.params.boardId;
const formData = ref({
  textInput: "",
  selectedOption: "read",
});
const router = useRouter();

// Handle form submission
const handleSubmit = async () => {
  try {
    const requestData = {
      email: formData.value.textInput,
      accessRight: "read",
    };
    const token = getToken();
    if (!token) {
      await useRefreshToken();
      token = getToken();
    }
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/collabs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );
    if (response.ok) {
      emits("update:showModal", false);
      router.push({ name: "board", params: { boardId: boardId } });
      showToast("Collaborator added successfully", "success-add");
    }
  } catch (error) {
    console.log(error);
  }
};
const handleClose = () => {
  emits("update:showModal", false);
};
const showToast = (message, type) => {
  switch (type) {
    case "success-add":
    case "success-update":
      toast.success(message, { position: POSITION.TOP_CENTER, timeout: 3000 });
      break;
    case "error":
      toast.error(message, { position: POSITION.TOP_CENTER, timeout: 3000 });
      break;
    default:
      toast(message);
  }
};
</script>

<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <!-- Modal Header -->
      <h2>Modal Title</h2>

      <!-- Text Field -->
      <label for="textInput">Enter Text:</label>
      <input v-model="textInput" id="textInput" type="text" />

      <!-- Dropdown -->
      <label for="options">Select Option:</label>
      <select v-model="selectedOption" id="options">
        <option value="READ">READ</option>
        <option value="WRITE">WRITE</option>
      </select>

      <!-- Submit Button -->
      <button @click="handleSubmit" class="text-green-500">Submit</button>
      <button @click="handleClose" class="text-red-500">Close</button>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

input,
select {
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
