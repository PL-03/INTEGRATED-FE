<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast, POSITION } from "vue-toastification";
import {
  getToken,
  useRefreshToken,
  decodedToken,
  removeTokens,
} from "@/services/tokenService";

const boardDetail = async () => {
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
    const ownBoard = boards.value.filter(
      (board) => board.owner.oid === userOid
    );
    const collabBoard = boards.value.filter((board) =>
      board.collaborators.some((collaborator) => collaborator.oid === userOid)
    );

    if (ownBoard.length > 0 && collabBoard.length === 0) {
      router.push({
        name: "tasklist",
        params: { boardId: ownBoard[0].id },
      });
    } else {
      router.push({ name: "boardslist" });
    }
  } catch (error) {
    console.error("Error fetching boards:", error);
  }
};
</script>

<template>
  <div></div>
</template>

<style scoped></style>
