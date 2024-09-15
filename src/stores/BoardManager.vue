<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import createBoard from "@/components/board/createBoard.vue";
import AddBoard from "@/components/board/AddBoard.vue";
import { isTokenExpired } from "@/libs/util";

const route = useRoute();
const router = useRouter();
const selectedBoard = ref({});
const showModal = ref(false);
const boards = ref([]);

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
const fetchBoards = async () => {
  if (!token) return;
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v3/boards`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    boards.value = data;
  } catch (error) {
    console.error("Error fetching boards:", error);
  }
};

onMounted(() => {
  fetchBoards();
});
const handleBoardAdded = () => {
  showModal.value = true;
  selectedBoard.value = {};
};
</script>

<template>
  <createBoard :boards="boards" @board-added="handleBoardAdded" />
  <AddBoard
    :show="showModal"
    :board="selectedBoard"
    @update:show="showModal = $event"
  />
</template>
