<script setup>
import { ref } from "vue";
import { useToast, POSITION } from "vue-toastification";
import { useRouter } from "vue-router";
import { isTokenExpired } from "../../libs/util";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
const router = useRouter();
const toast = useToast();

const boardName = ref({
  name: "",
});

const isTokenValid = ref(true);

const getToken = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token || isTokenExpired(token)) {
    isTokenValid.value = false;
    localStorage.removeItem("jwtToken");
    alert("Your session has expired. Please login again.");
    router.push({ name: "login" });
    return null;
  }
  return token;
};
const token = getToken();
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
    if (!token) return;
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
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-xl w-1/3">
      <div class="border-b px-4 py-3">
        <h2 class="text-xl font-semibold text-gray-800">New Board</h2>
      </div>
      <div class="px-4 py-5">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="board-name"
          >Name</label
        >
        <input
          type="text"
          v-model="boardName.name"
          id="board-name"
          class="border rounded w-full py-2 px-3 text-gray-700"
          placeholder="Enter board name"
        />
      </div>
      <div class="flex justify-end px-4 py-3 bg-gray-50 border-t">
        <button
          @click="closeModal"
          class="bg-gray-500 text-white py-2 px-4 rounded mr-2"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          class="bg-green-500 text-white py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
