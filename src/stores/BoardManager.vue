<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import createBoard from "@/components/board/createBoard.vue";
import AddBoard from "@/components/board/AddBoard.vue";
import { isTokenExpired } from "@/libs/util";
import VueJwtDecode from "vue-jwt-decode";

const route = useRoute();
const router = useRouter();
const selectedBoard = ref({});
const showModal = ref(false);
const boards = ref([]);
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
const fetchBoards = async () => {
  if (!token) return;
  const decodedToken = VueJwtDecode.decode(token);
  const userOid = decodedToken.oid; // Adjust based on your token structure
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v3/boards`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    boards.value = data;
    boards.value = data.filter((board) => board.owner.oid === userOid);
    if (boards.value.length > 0) {
      // Redirect to the first board the user owns
      router.push({
        name: "tasklist",
        params: { boardId: boards.value[0].id },
      });
    } else {
      // Redirect to the boards list if no boards are found
      router.push({ name: "boardslist" });
    }
  } catch (error) {
    console.error("Error fetching boards:", error);
  }
};
const fetchBoardsById = async (boardId) => {
  console.log(boardId);

  if (!token) return;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    selectedBoard.value = data;
  } catch (error) {
    console.error("Error fetching boards:", error);
  }
};
onMounted(() => {
  fetchBoards();
  // console.log(boards.value);
  // console.log(boards.value.length);
});
const handleBoardAdded = () => {
  showModal.value = true;
  selectedBoard.value = {};
};
const handleBoardUpdated = (newBoard) => {
  boards.value.push(newBoard); // Add the new board to the list
  selectedBoard.value = newBoard; // Set the new board as selected
  router.push({ name: "tasklist", params: { boardId: newBoard.boardId } });
};
</script>

<template>
  <createBoard :boards="boards" @board-added="handleBoardAdded" />
  <AddBoard
    :show="showModal"
    :board="selectedBoard"
    @update:show="showModal = $event"
    @board-added="handleBoardUpdated"
  />
</template>
