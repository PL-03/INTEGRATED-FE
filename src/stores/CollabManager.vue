<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch, watchEffect } from "vue";
import {
  getToken,
  useRefreshToken,
  removeTokens,
  decodedToken,
} from "@/services/tokenService";
import CollabBoard from "@/components/board/CollabBoard.vue";
import AddCollaborator from "@/components/task/AddCollaborator.vue";

const router = useRouter();
const route = useRoute();
const boardId = route.params.boardId;
const collabModal = ref(false);
const boardCollaborators = ref([]);
const tokenDecoded = decodedToken();
const selectedBoard = ref({});
const oid = tokenDecoded.oid;
const fetchBoardColaborators = async () => {
  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/collabs`,
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
      console.log(data);

      // router.push({ name: "denial" });
    }
  } catch (error) {
    console.error("Error fetching boards:", error);
  }
};

onMounted(async () => {
  await fetchBoardColaborators();
});
const handleAddCollaborator = () => {
  collabModal.value = true;
};
</script>

<template>
  <CollabBoard
    :boardCollaborators="boardCollaborators"
    @add-collaborator="handleAddCollaborator"
  />
  <AddCollaborator
    v-if="collabModal"
    :showModal="collabModal"
    @update:showModal="collabModal = $event"
    @collaborator-added="fetchBoardColaborators"
  />
</template>

<style scoped></style>
