<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import BoardList from "@/components/board/BoardList.vue";
import AddBoard from "@/components/board/AddBoard.vue";
import {
  getToken,
  decodedToken,
  useRefreshToken,
} from "@/services/tokenService";

const router = useRouter();
const selectedBoard = ref({});
const showModal = ref(false);
const boards = ref([]);
const boardCollaborators = ref([]);

const fetchBoardColaborators = async () => {
  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  const tokenDecoded = decodedToken();
  const oid = tokenDecoded.oid;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${
        boards.value.find((board) => board.owner.oid !== oid).id
      }/collabs`,
      {
        headers: {
          Authization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      boardCollaborators.value = data;
    } else if (response.status === 401) {
      removeTokens();
      router.push({ name: "login" });
    } else if (response.status === 403) {
      router.push({ name: "denial" });
    }
  } catch (error) {
    console.error("Error fetching boards:", error);
  }
};
const fetchBoards = async () => {
  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  const tokenDecoded = decodedToken();
  const userOid = tokenDecoded.oid; // Adjust based on your token structure
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v3/boards`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    boards.value = data;
    // router.push({ name: "boardslist" });
    const ownBoard = boards.value.filter(
      (board) => board.owner.oid === userOid
    );
    const collabBoard = boards.value.filter((board) =>
      board.collaborators.some((collaborator) => collaborator.oid === userOid)
    );
    if (ownBoard.length > 0 && collabBoard.length === 0) {
      // Redirect to the first board the user owns
      router.push({
        name: "tasklist",
        params: { boardId: boards.value[0].id },
      });
    } else {
      router.push({ name: "boardslist" });
    }
  } catch (error) {
    console.error("Error fetching boards:", error);
  }
};
// const fetchBoardsById = async (boardId) => {
//   console.log(boardId);
//   const token = getToken();
//   if (!token) {
//     await useRefreshToken();
//     token = getToken();
//   }
//   try {
//     const response = await fetch(
//       `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const data = await response.json();
//     selectedBoard.value = data;
//   } catch (error) {
//     console.error("Error fetching boards:", error);
//   }
// };
onMounted(async () => {
  await fetchBoards();
  // await fetchBoardColaborators();
});
const handleBoardAdded = () => {
  showModal.value = true;
  selectedBoard.value = {};
};
const handleBoardUpdated = (newBoard) => {
  boards.value.push(newBoard); // Add the new board to the list
  selectedBoard.value = newBoard; // Set the new board as selected
  console.log(newBoard);

  router.push({ name: "tasklist", params: { boardId: newBoard.id } });
};
</script>

<template>
  <BoardList
    :boards="boards"
    :boardCollaborators="boardCollaborators"
    @board-added="handleBoardAdded"
  />
  <AddBoard
    :show="showModal"
    :board="selectedBoard"
    @update:show="showModal = $event"
    @board-added="handleBoardUpdated"
  />
</template>
