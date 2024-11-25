<script setup>
import { onMounted, onUpdated, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast, POSITION } from "vue-toastification";
import { getToken, decodedToken, removeTokens } from "@/services/tokenService";
const props = defineProps({
  boardCollaborators: { type: Array, required: true },
  board: { type: Object, required: true },
});
const emit = defineEmits(["add-collaborator"]);
const route = useRoute();
const router = useRouter();
const boardName = ref("");
const username = ref("");
const tokenDecoded = ref({});
const isOwner = ref(false);
const currentId = ref("");
const board = ref({});
const boardId = route.params.boardId;
const showDropdown = ref(false);
const boards = ref([...props.boardCollaborators]);
const isWriteCollab = ref(false);
const isDisabled = ref(false);
const hadleChangePermission = (permission, board) => {
  emit("change-permission", permission.target.value, board);
};
const handleRemoveCollaborator = (board) => {
  emit("remove-collaborator", board);
};
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};
const fetchBoard = async () => {
  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
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
      board.value = data;
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
    console.error("Error fetching boards:", error);
  }
};

onMounted(async () => {
  console.log(boards.value);

  await fetchBoard();
  tokenDecoded.value = decodedToken();
  username.value = tokenDecoded.value.name;
  currentId.value = tokenDecoded.value.oid;
  isOwner.value = board.value.owner.oid === currentId.value;
  boardName.value = board.value.name;
  boards.value = boards.value.sort(
    (a, b) => new Date(a.added_on) - new Date(b.added_on)
  );

  const matchCurrentUser = board.value.collaborators.find(
    (collaborator) => collaborator.oid === currentId.value
  );

  if (matchCurrentUser) {
    isWriteCollab.value = matchCurrentUser.accessRight === "WRITE";
    isDisabled.value = !isOwner.value && !isWriteCollab.value;
  }
});
watch(
  () => props.boardCollaborators,
  () => {
    boards.value = [...props.boardCollaborators];
  }
);
const handleAddCollaborator = () => {
  emit("add-collaborator");
};
const back = () => {
  router.push({ name: "tasklist", params: { boardId: boardId } });
};
const logout = () => {
  removeTokens();
  router.push({ name: "login" });
};
</script>

<template>
  <div class="bg-[#dfe0e2] min-h-screen font-lilita">
    <nav
      class="navbar h-20 flex justify-between fixed left-0 right-0 top-0 z-10 shadow-md shadow-[#95999ad8]"
    >
      <!-- shadow-md bg-gradient-to-t from-blue-100 via-blue-300 to-blue-900 shadow-[#5d5d5fc7] bg-[#eaeef2]-->
      <div class="image flex h-14 m-2">
        <!-- <img
          class="ml-4"
          src="https://www.sit.kmutt.ac.th/wp-content/uploads/2016/12/logo-kmutt.png"
        /> -->
        <h1
          class="text-start text-2xl font-lilita p-4 text-black tracking-wide"
        >
          IT-Bangmod Kradan Kanban
        </h1>
      </div>

      <div class="flex m-4 items-center space-x-6">
        <div class="relative text-black">
          <button
            @click="toggleDropdown"
            class="flex items-center hover:text-[#4d5fcb] itbkk-fullname"
          >
            <svg
              class="mr-2"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6m0 14c-2.03 0-4.43-.82-6.14-2.88a9.95 9.95 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20"
              />
            </svg>
            {{ username }}
            <svg
              class="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2"
          >
            <ul>
              <li>
                <button
                  @click="logout"
                  class="flex flex-row text-center px-4 py-2 hover:text-[#ba493f]"
                >
                  <img
                    src="../../assets/SignOut.png"
                    width="22"
                    height="10"
                    class="mr-2 mt-1"
                  />
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <div class="flex flex-col justify-center items-center p-28">
      <div class="text-3xl drop-shadow-lg p-4 itbkk-collab-board">
        Collaborator Management
      </div>

      <div class="flex w-9/12 justify-between">
        <div class="flex font-lilita">
          <button class="p-2 rounded itbkk-board-name">
            <!-- ยังไม่ใส่ @click -->
            <p
              class="text-[#2d3697] decoration-2 hover:underline decoration-[#3b6ac0]"
              @click="back"
            >
              {{ boardName }}
            </p>
          </button>
          <strong class="text-[#525454] mt-2 ml-2"> > </strong>
          <p class="text-gray-600 mt-2 ml-4">Collaborator</p>
        </div>

        <button
          :disabled="isDisabled"
          class="addBtn itbkk-collaborator-add flex text-md w-36 h-8 items-center justify-center hover:bg-[#4ae77c] bg-[#4cdb79] text-black rounded font-lilita tracking-wide"
          @click="handleAddCollaborator"
        >
          Add Collaborator
        </button>
      </div>

      <!-- <div class="w-full overflow-x-auto"> -->
      <table
        class="table-auto rounded-md overflow-hidden itbkk-table bg-[#39407e]"
      >
        <thead>
          <tr class="text-white">
            <th>No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Access Right</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody
          v-for="(board, index) in boards"
          :key="index"
          :class="index % 2 === 0 ? 'bg-[#def3f4]' : 'bg-[#eaf9f9]'"
          class="text-center border font-lilita"
        >
          <tr class="itbkk-item">
            <td>{{ index + 1 }}</td>
            <td>
              <tr @click="handleViewBoard(board.name)" class="itbkk-name">
                <span class="itbkk-email text-[#020202]"
                  >{{ board.name }}
                  <span
                    v-if="board.accessRight === 'PENDING'"
                    class="text-gray-500"
                    >(Pending Invite)</span
                  ></span
                >
              </tr>
            </td>
            <td>
              <!-- E-mail -->
              <span class="itbkk-email text-[#000000]">{{ board.email }}</span>
            </td>
            <td>
              <select
                v-if="board.accessRight === 'PENDING'"
                v-model="board.assignedAccessRight"
                id="options"
                class="itbkk-access-right p-1 bg-[#d0d2d3] rounded"
                @change="hadleChangePermission($event, board)"
              >
                <option :value="board.assignedAccessRight">
                  {{ board.assignedAccessRight }}
                </option>
                <option
                  v-if="board.assignedAccessRight === 'READ'"
                  value="WRITE"
                >
                  WRITE
                </option>
                <option
                  v-if="board.assignedAccessRight === 'WRITE'"
                  value="READ"
                >
                  READ
                </option>
              </select>
              <!-- Access Right -->
              <select
                v-else
                v-model="board.accessRight"
                id="options"
                class="itbkk-access-right p-1 bg-[#d0d2d3] rounded"
                @change="hadleChangePermission($event, board)"
              >
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </td>
            <td>
              <button
                class="itbkk-collab-remove bg-[#db2d2d] text-white text-sm py-1 px-2 rounded hover:bg-[#888a94]"
                @click="handleRemoveCollaborator(board)"
                :disabled="isDisabled"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  background: linear-gradient(
    135deg,
    rgb(252, 255, 219) 20%,
    rgb(152, 217, 255) 40%,
    rgb(255, 221, 216) 100%
  );
}

.table-auto thead th {
  width: 195px;
  min-width: 190px;
  text-align: center;
}

.table-auto tbody td {
  min-width: 150px;
}

.table-auto thead .itbkk-board-name {
  width: 220px;
}

thead th {
  padding: 8px;
}

tbody td {
  padding: 8px;
}

@media (max-width: 768px) {
  .p-28 {
    padding: 10px;
  }

  thead th,
  tbody td {
    padding: 8px;
    font-size: 14px;
  }

  .text-3xl {
    font-size: 24px;
  }

  /* Reduce table column width for smaller screens */
  thead th,
  tbody td {
    min-width: auto;
    width: auto;
  }

  /* Make the table scrollable */
  .table-auto {
    min-width: 600px;
  }
}
.addBtn:disabled {
  background-color: #858d8d;
  cursor: not-allowed;
  opacity: 0.6;
}

.itbkk-collab-remove:disabled {
  background-color: rgb(144, 150, 150);
  cursor: not-allowed;
}
.itbkk-access-right:disabled {
  cursor: not-allowed;
}
</style>
