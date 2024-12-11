<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch, watchEffect } from "vue";
import { useToast, POSITION } from "vue-toastification";
import {
  getToken,
  useRefreshToken,
  removeTokens,
  decodedToken,
} from "@/services/tokenService";
import CollabBoard from "@/components/board/CollabBoard.vue";
import AddCollaborator from "@/components/task/AddCollaborator.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";

const router = useRouter();
const route = useRoute();
const boardId = route.params.boardId;
const collabModal = ref(false);
const boardCollaborators = ref([]);
const tokenDecoded = decodedToken();
const selectedBoard = ref({});
const oid = tokenDecoded.oid;
const showConfirmationModal = ref(false);
const collabDetail = ref(null);
const permissionTochange = ref(null);
const showChangePermission = ref(false);

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
const confirmDeleteCollaborator = async () => {
  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/collabs/${
        collabDetail.value.oid
      }`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      showToast(
        "The collaborator has been successfully deleted",
        "success-delete"
      );
      fetchBoardColaborators();
      showConfirmationModal.value = false;
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
      showToast("You are not allowed to perform this action", "error");
    }
  } catch (error) {
    console.log(error);
  }
};
const confirmPermissionChange = async (e) => {
  let url =
    e === "edit"
      ? `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/collabs/${
          collabDetail.value.oid
        }`
      : `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/collabs/${
          collabDetail.value.oid
        }/pending`;
  console.log(url);

  let token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessRight: permissionTochange.value }),
    });
    if (response.ok) {
      if (e === "editPending") {
        showToast(
          "The 'PENDING' collaborator access right has been successfully updated",
          "success-update"
        );
      } else {
        showToast(
          "The collaborator access right has been successfully updated",
          "success-update"
        );
      }

      fetchBoardColaborators();
      showChangePermission.value = false;
    } else if (response.status === 404) {
      alert("The collaborator does not exist");
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
      showToast("You are not allowed to perform this action", "error");
    }
  } catch (error) {
    console.log(error);
  }
};
onMounted(async () => {
  await fetchBoardColaborators();
});
const handleAddCollaborator = () => {
  collabModal.value = true;
};
const handleRemoveCollaborator = (collaborator) => {
  showConfirmationModal.value = true;
  collabDetail.value = collaborator;
  console.log(collabDetail.value);
};
const handlePermissionChange = (permission, board) => {
  collabDetail.value = board;
  permissionTochange.value = permission;
  showChangePermission.value = true;
};
const closeModal = () => {
  fetchBoardColaborators();
  showConfirmationModal.value = false;
  showChangePermission.value = false;
};
const showToast = (message, type) => {
  const toast = useToast();

  switch (type) {
    case "success-add":
    case "success-update":
    case "success-delete":
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
  <CollabBoard
    :boardCollaborators="boardCollaborators"
    @add-collaborator="handleAddCollaborator"
    @remove-collaborator="handleRemoveCollaborator"
    @change-permission="handlePermissionChange"
  />
  <AddCollaborator
    v-if="collabModal"
    :showModal="collabModal"
    @update:showModal="collabModal = $event"
    @collaborator-added="fetchBoardColaborators"
  />
  <ConfirmationModal
    v-if="showConfirmationModal || showChangePermission"
    :showConfirmationModal="showConfirmationModal"
    :showChangePermission="showChangePermission"
    :collabDetail="collabDetail"
    :permissionToChange="permissionTochange"
    @close="closeModal"
    @confirm="confirmDeleteCollaborator"
    @confirmPermissionChange="confirmPermissionChange"
  />
</template>

<style scoped></style>
