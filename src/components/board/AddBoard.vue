<script setup>
import { ref, onMounted, watchEffect, onUpdated } from "vue";
import { useToast, POSITION } from "vue-toastification";
import { useRouter } from "vue-router";
import {
  isTokenExpired,
  getToken,
  decodedToken,
  useRefreshToken,
} from "@/services/tokenService";
import VueJwtDecode from "vue-jwt-decode";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
const router = useRouter();
const toast = useToast();
const username = ref("");
const tokenDecoded = ref({});
const boardName = ref({
  name: "",
});
// const decodedToken = () => {
//   const token = localStorage.getItem("jwtToken");
//   const refreshToken = localStorage.getItem("refreshToken");
//   if (!token || isTokenExpired(token)) {
//     if (!refreshToken || isTokenExpired(refreshToken)) {
//       removeTokens();
//       router.push({ name: "login" });
//       return;
//     }
//   }
//   const decodedToken = VueJwtDecode.decode(token);
//   username.value = decodedToken.name;

//   boardName.value.name = `${username.value}'s personal board`;
// };

onMounted(() => {
  tokenDecoded.value = decodedToken();
  username.value = tokenDecoded.value.name;
  boardName.value.name = `${username.value} personal board`;
});

const emit = defineEmits(["update:show", "board-added"]);
const closeModal = () => {
  emit("update:show", false);
  router.push({ name: "boardslist" });
};

const handleSubmit = async () => {
  try {
    const requestData = {
      name: boardName.value.name,
    };
    let token = getToken();
    if (!token) {
      await useRefreshToken();
      token = getToken();
    }
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v3/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });
    if (response.ok) {
      const newBoard = await response.json(); // Get the newly created board data from the response
      emit("update:show", false);
      emit("board-added", newBoard); // Emit the new board data
      showToast("Board created successfully", "success-add");
    }
  } catch (error) {
    console.log(error);
  }
};
const showToast = (message, type) => {
  const toast = useToast();

  switch (type) {
    case "success-add":
      toast.success(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
      });
      break;
    case "success-update":
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
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm font-lilita"
  >
    <div
      class="itbkk-modal-new bg-white rounded-lg shadow-xl w-1/3 tracking-wide"
    >
      <div class="border-b px-4 py-3">
        <h2 class="text-xl font-medium text-[#232f96]">New Board</h2>
      </div>
      <div class="px-4 py-5">
        <label
          class="block text-gray-700 text-md font-medium mb-2"
          for="board-name"
          >Name</label
        >
        <input
          type="text"
          v-model="boardName.name"
          id="board-name"
          class="itbkk-board-name border rounded w-full py-2 px-3 text-gray-700"
          maxlength="120"
          placeholder="Enter board name"
        />
      </div>
      <div class="flex justify-end px-4 py-3 gap-1 bg-gray-50 border-t">
        <button
          @click="handleSubmit"
          class="itbkk-button-ok save bg-green-500 text-white py-2 px-4 rounded"
          :disabled="!boardName.name"
        >
          Ok
        </button>
        <button
          @click="closeModal"
          class="itbkk-button-cancel bg-[#de5858] text-white py-2 px-4 rounded mr-2"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.save:disabled {
  background-color: #686c6dd4;
  color: #fefefe;
}
</style>
