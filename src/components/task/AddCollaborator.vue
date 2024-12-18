<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast, POSITION } from "vue-toastification";
import {
  getToken,
  useRefreshToken,
  decodedToken,
  removeTokens,
} from "@/services/tokenService";

// Define props to control modal visibility
const props = defineProps({ showModal: { type: Boolean, required: true } });
const emits = defineEmits(["update:showModal", "collaborator-added"]);
const route = useRoute();
const textInput = ref("");
const selectedOption = ref("READ");
const boardId = route.params.boardId;
const isEmailValid = ref(false);
const isOwner = ref(false);
const tokenDecoded = decodedToken();
const currentEmail = tokenDecoded.email;
// Define the regular expression for the email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

watch(textInput, (newVal) => {
  isEmailValid.value = emailRegex.test(newVal);
  isOwner.value = newVal === currentEmail;
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

  const sendingToastId = showToast("Sending request, please wait", "info"); // Capture the toast ID
  const currentEmail = tokenDecoded.email;

  if (currentEmail === textInput.value) {
    useToast().dismiss(sendingToastId); // Dismiss the toast
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

    useToast().dismiss(sendingToastId);

    if (response.ok) {
      emits("update:showModal", false);
      emits("collaborator-added");
      showToast("Collaborator successfully added", "success-add");
    } else if (response.status === 401) {
      if (!token) {
        await useRefreshToken();
        token = getToken();
      } else {
        removeTokens();
        router.push({ name: "login" });
      }
    } else if (response.status === 403) {
      showToast("You don't have permission to add collaborators", "error");
    } else if (response.status === 404) {
      showToast("Your email is not valid", "error");
    } else {
      showToast("An error occurred while adding the collaborator", "error");
    }
  } catch (error) {
    console.error(error);
    useToast().dismiss(sendingToastId); // Ensure toast is dismissed on error
    showToast("An unexpected error occurred", "error");
  }
};

const handleClose = () => {
  emits("update:showModal", false);
};
const showToast = (message, type) => {
  const toast = useToast();
  let toastId;

  switch (type) {
    case "info":
      toastId = toast.info(message, {
        position: POSITION.TOP_CENTER,
        timeout: false, // Prevent auto-dismiss for info type
        hideProgressBar: false,
      });
      break;
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

  return toastId; // Return the toast instance or ID
};
</script>

<template>
  <div v-if="showModal" class="modal">
    <div class="itbkk-modal-alert modal-content font-lilita">
      <!-- Modal Header -->
      <p class="text-xl text-[#674d3f]">Add Collaborator</p>
      <hr class="divider" />
      <div class="flex mt-4 mx-4 justify-center items-center">
        <div class="mr-2">
          <label for="textInput" class="itbkk-label flex items-start"
            >Collaborator Email</label
          >

          <input
            v-model="textInput"
            id="textInput"
            type="email"
            maxlength="50"
            class="itbkk-collaborator-email"
            placeholder="eg. itbkk.name@ad.sit.kmutt.ac.th"
          />
        </div>

        <div>
          <!-- Dropdown -->
          <label for="options" class="flex items-start">Access Right</label>
          <select
            v-model="selectedOption"
            id="options"
            class="itbkk-access-right"
          >
            <option value="READ">READ</option>
            <option value="WRITE">WRITE</option>
          </select>
        </div>
      </div>
      <p
        v-if="isOwner && textInput.length > 0"
        style="color: red"
        class="text-left mt-1 ml-2"
      >
        You can't add yourself as a collaborator.
      </p>

      <!-- Error message if the email is invalid -->
        <p v-if="!isEmailValid && textInput.length > 0" style="color: red" class="text-left mt-1 ml-2">
          Please enter a valid email address.
        </p>
      <!-- Submit Button -->
      <div class="button flex justify-end mt-4">
        <button
          @click="handleSubmit"
          :disabled ="!isEmailValid || isOwner"
          class="addBtn text-white bg-green-600 hover:bg-green-500 w-16 h-8 mr-2"
        >
          Add
        </button>
        <button
          @click="handleClose"
          class="text-white bg-red-600 hover:bg-red-500 h-8 w-16"
        >
          Cancel
        </button>
      </div>
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

input {
  padding: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
select {
  padding: 11px;
  width: 135px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  border-radius: 4px;
}
.addBtn:disabled {
  background-color: #7c7f81;
  cursor: not-allowed;
}
.divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 10px 0;
}
</style>
