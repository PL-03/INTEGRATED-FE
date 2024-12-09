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
const collab = ref({});
const owner = ref({});
const collaborator = ref({});
const tokenDecoded = ref("");
const emit = defineEmits(["accept", "decline"]);
const boardDetail = async () => {
  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  tokenDecoded.value = decodedToken();
  const userOid = tokenDecoded.value.oid;
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
const fetchBoardColaborators = async () => {
  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/collabs/${
        tokenDecoded.value.oid
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      collab.value = data;
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
  await fetchBoardColaborators();
  if (tokenDecoded.value.oid !== collab.value.oid) {
    router.push({ name: "denial" });
  }
  console.log(collab.value.oid);
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
  <div class="allBG text-center min-h-screen font-lilita">
    <div class="modal-overlay">
      <div class="modal-content shadow-lg shadow-[#87898bd8]">
        <p class="text-2xl text-[#644e44] tracking-wider">Invitation</p>
        <div class="flex flex-col items-center">
          <img
            src="../assets/add-user.gif"
            alt="Invite"
            width="96"
            height="96"
            class="my-4"
          />
        </div>
        <div class="mb-8 text-left p-2">
          <span class="text-[#2d3fb0] tracking-wider">{{ owner.name }}</span>
          has invited you to collaborate with
          <span class="font-semibold tracking-wider">{{
            collab.assignedAccessRight
          }}</span>
          access right on
          <span class="text-[#2d3fb0] tracking-wider">{{
            boardCollaborators.name
          }}</span>
        </div>
        <div>
          <button
            class="mr-2 bg-green-600 hover:bg-green-500 text-white p-2 rounded"
            @click="handleAccept"
          >
            Accept invitation
          </button>
          <button
            class="bg-red-800 hover:bg-red-500 text-white p-2 rounded"
            @click="handleDecline"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.allBG {
  background: linear-gradient(
    185deg,
    rgb(110, 110, 111) 10%,
    rgb(141, 145, 152) 40%,
    #c6c8c8 80%
      /* 135deg,
    rgb(198, 227, 255) 5%,
    rgb(255, 248, 204) 40%,
    #d2d2d2 70% */
  );
}
.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  max-width: 400px;
  width: 100%;
  max-height: 800px;
  height: 400px;
  overflow-y: auto;
}
.modal-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
