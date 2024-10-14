<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast, POSITION } from "vue-toastification";
import {
  getToken,
  useRefreshToken,
  decodedToken,
} from "@/services/tokenService";

// Define props to control modal visibility
const props = defineProps({ showModal: { type: Boolean, required: true } });
const emits = defineEmits(["update:showModal", "collaborator-added"]);
const route = useRoute();
const textInput = ref("");
const selectedOption = ref("READ");
const boardId = route.params.boardId;
const isEmailValid = ref(false); // Track email validity

// Define the regular expression for the email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

watch(textInput, (newVal) => {
  isEmailValid.value = emailRegex.test(newVal);
});

// const formData = ref({
//   textInput: "",
//   selectedOption: "READ",
// });
const router = useRouter();

// Handle form submission
const handleSubmit = async () => {
  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  const tokenDecoded = decodedToken();
  const currentEmail = tokenDecoded.email;
  if (currentEmail === textInput.value) {
    showToast("You cannot add yourself as a collaborator", "error");
    return;
  }
  try {
    const requestData = {
      email: textInput.value,
      accessRight: selectedOption.value,
    };
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
      emits("collaborator-added");
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
  const toast = useToast();

  switch (type) {
    case "success-add":
    case "success-update":
    case "success-delete":
      toast.success(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      });
      break;
    case "error":
      toast.error(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      });
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
      <label for="textInput">Enter Email:</label>
      <input v-model="textInput" id="textInput" type="email" maxlength="50" />

      <!-- Error message if the email is invalid -->
      <p v-if="!isEmailValid && textInput.length > 0" style="color: red">
        Please enter a valid email address.
      </p>

      <!-- Dropdown -->
      <label for="options">Select Option:</label>
      <select v-model="selectedOption" id="options">
        <option value="READ">READ</option>
        <option value="WRITE">WRITE</option>
      </select>

      <!-- Submit Button -->
      <button
        @click="handleSubmit"
        :disabled="!isEmailValid"
        class="text-white bg-green-600 hover:bg-green-800"
      >
        Add
      </button>
      <button
        @click="handleClose"
        class="text-white bg-red-600 hover:bg-red-800"
      >
        Cancel
      </button>
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
