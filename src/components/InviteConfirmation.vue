<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast, POSITION } from "vue-toastification";
import {
  getToken,
  useRefreshToken,
  decodedToken,
  removeTokens,
} from "@/services/tokenService";
const router = useRouter();
const route = useRoute();
const boardId = route.params.boardId;
const boardCollaborators = ref({});
const owner = ref({});
const collaborator = ref({});
const emit = defineEmits(["accept", "decline"]);
const boardDetail = async () => {
  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  const tokenDecoded = decodedToken();
  const userOid = tokenDecoded.oid;
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
    if (response.ok) {
      collaborator.value = data.collaborators.find(
        (col) => col.oid === userOid
      );
      boardCollaborators.value = data;
      owner.value = data.owner;
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
onMounted(async () => {
  await boardDetail();
});

const handleAccept = async () => {
  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${
        boardCollaborators.value.id
      }/collabs/${collaborator.value.oid}/accept`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      router.push({
        name: "tasklist",
        params: { boardId: boardCollaborators.value.id },
      });
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

const handleDecline = async () => {
  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${
        boardCollaborators.value.id
      }/collabs/${collaborator.value.oid}/decline`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      router.push({ name: "boardslist" });
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
</script>

<template>
  <div>
    <span class="font-semibold">{{ owner.name }}</span> has invited you to
    collaborate with <span class="font-semibold"> {accessRight}</span> access
    right on <span class="font-semibold">{{ boardCollaborators.name }}</span>
  </div>
  <div>
    <button
      class="mr-2 bg-green-800 hover:bg-green-500 text-white"
      @click="handleAccept"
    >
      Accept invitation
    </button>
    <button
      class="bg-red-800 hover:bg-red-500 text-white"
      @click="handleDecline"
    >
      Decline
    </button>
  </div>
</template>

<style scoped></style>
