<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import BoardList from "@/components/board/BoardList.vue";
import AddBoard from "@/components/board/AddBoard.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import {
  getToken,
  decodedToken,
  useRefreshToken,
  removeTokens,
} from "@/services/tokenService";
const route = useRoute();
const router = useRouter();
const selectedBoard = ref({});
const showModal = ref(false);
const boards = ref([]);
const boardCollaborators = ref([]);
const showDeleteModal = ref(false);
const boardDetail = ref({});
const oidToDelete = ref("");
const boardId = route.params.boardId;

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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      boardCollaborators.value = data;
    } else if (response.status === 401) {
      let token = getToken();
      if (!token) {
        await useRefreshToken();
        token = getToken();
      } else if (!token) {
        removeTokens();
        router.push({ name: "login" });
      }
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
const confirmDeleteCollaborator = async () => {
  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${
        boardDetail.value.id
      }/collabs/${oidToDelete.value}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      fetchBoards();
      showDeleteModal.value = false;
    } else if (response.status === 404) {
      alert("The requested board does not exist");
      router.push({ name: "boardslist" });
    } else if (response.status === 401) {
      let token = getToken();
      if (!token) {
        await useRefreshToken();
        token = getToken();
      } else if (!token) {
        removeTokens();
        router.push({ name: "login" });
      }
    } else if (response.status === 403) {
      router.push({ name: "denial" });
    }
  } catch (error) {
    console.log(error);
  }
};
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
const handleRemoveCollaborator = (board, collaborator) => {
  boardDetail.value = board;
  oidToDelete.value = collaborator;
  // console.log(boardDetail.value);

  showDeleteModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
  showDeleteModal.value = false;
};
</script>

<template>
  <BoardList
    :boards="boards"
    :boardCollaborators="boardCollaborators"
    @board-added="handleBoardAdded"
    @remove-collaborator="handleRemoveCollaborator"
  />
  <AddBoard
    :show="showModal"
    :board="selectedBoard"
    @update:show="showModal = $event"
    @board-added="handleBoardUpdated"
  />
  <ConfirmationModal
    v-if="showDeleteModal"
    :showDeleteModal="showDeleteModal"
    :boardDetail="boardDetail"
    @close="closeModal"
    @confirm="confirmDeleteCollaborator"
  />
</template>
