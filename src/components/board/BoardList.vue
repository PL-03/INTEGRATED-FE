<script setup>
import { ref, onMounted, onUpdated, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast, POSITION } from "vue-toastification";
import { getToken, decodedToken, removeTokens } from "@/services/tokenService";
import VueJwtDecode from "vue-jwt-decode";

const props = defineProps({
  boards: {
    type: Array,
    required: true,
  },
  boardCollaborators: {
    type: Array,
  },
});
const showDropdown = ref(false);
const router = useRouter();
// const token = getToken();
const username = ref("");
const oid = ref("");
const emit = defineEmits(["board-added"]);
const tokenDecoded = ref({});
const board = ref([...props.boards]);
const collabBoard = ref([...props.boards]);
const haveBoard = ref(false);
const boardCollaborators = ref([]);
let token = getToken();
// const fetchBoardColaborators = async () => {
//   const token = getToken();
//   if (!token) {
//     await useRefreshToken();
//     token = getToken();
//   }
//   try {
//     const response = await fetch(
//       `${import.meta.env.VITE_BASE_URL}/v3/boards/${
//         board.value.find((board) => board.owner.oid === oid.value).id
//       }/collabs`,
//       {
//         headers: {
//           Authization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const data = await response.json();
//     if (response.ok) {
//       boardCollaborators.value = data;
//     } else if (response.status === 401) {
//       removeTokens();
//       router.push({ name: "login" });
//     } else if (response.status === 403) {
//       router.push({ name: "denial" });
//     }
//   } catch (error) {
//     console.error("Error fetching boards:", error);
//   }
// };

onMounted(async () => {
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  tokenDecoded.value = decodedToken();
  username.value = tokenDecoded.value.name;
  oid.value = tokenDecoded.value.oid;
  board.value = props.boards.filter((board) => board.owner.oid === oid.value);
  haveBoard.value = board.value.length > 0;
  console.log(haveBoard.value);

  collabBoard.value = props.boards.filter((board) =>
    board.collaborators.some((collaborator) => collaborator.oid === oid.value)
  );
  console.log(collabBoard.value);
  console.log(board.value);
});
onUpdated(() => {
  haveBoard.value = board.value.length > 0;
});
watch(
  () => props.boards,
  (newBoards) => {
    board.value = newBoards.filter((board) => board.owner.oid === oid.value);
    collabBoard.value = newBoards.filter((board) =>
      board.collaborators.some((collaborator) => collaborator.oid === oid.value)
    );
  }
);

const handleAddBoard = () => {
  router.push({ name: "boardadd" });
  emit("board-added");
};
const handleViewBoard = (id) => {
  router.push({ name: "tasklist", params: { boardId: id } });
};
const logout = () => {
  removeTokens();
  router.push({ name: "login" });
};
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};
</script>

<template>
  <!-- bg-gradient-to-t from-gray-500 to-blue-100 -->
  <div class="bg-[#dfe0e2] min-h-screen font-lilita">
    <nav
      class="navbar h-20 flex justify-between fixed left-0 right-0 top-0 z-10 shadow-md shadow-[#95999ad8]"
    >
      <!-- shadow-md bg-gradient-to-t from-blue-100 via-blue-300 to-blue-900 shadow-[#5d5d5fc7] bg-[#eaeef2]-->
      <div class="image flex h-14 m-2">
        <img
          class="ml-4"
          src="https://www.sit.kmutt.ac.th/wp-content/uploads/2016/12/logo-kmutt.png"
        />
        <h1
          class="text-start text-2xl font-lilita p-4 text-black tracking-wide"
        >
          IT-Bangmod Kradan Kanban
        </h1>
      </div>

      <div class="flex m-4 items-center space-x-6">
        <button
          class="createBtn flex items-center text-md text-black hover:text-blue-600 transition duration-300 itbkk-button-add"
          @click="handleAddBoard"
          :disabled="haveBoard"
        >
          Create New Board
        </button>

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

    <div></div>
    <!-- table personal board -->
    <div
      v-if="boards.length !== 0"
      class="flex flex-col justify-center items-center p-28"
    >
      <div class="text-3xl drop-shadow-lg p-4 itbkk-personal-board">
        Board <span class="text-[#2b4483] ml-2">{{ username }}</span>
      </div>

      <table
        class="table-auto rounded-md overflow-hidden itbkk-table bg-[#39407e] min-w-full"
      >
        <thead>
          <tr class="text-white">
            <th>No.</th>
            <th>Name</th>
            <th>Visibility</th>
          </tr>
        </thead>
        <tbody
          v-for="(board, index) in board"
          :key="index"
          :class="index % 2 === 0 ? 'bg-[#e0e5e2]' : 'bg-[#e8f4f4]' "
          class="text-center border itbkk-item font-lilita"
        >
          <tr class="itbkk-personal-item">
            <td>{{ index + 1 }}</td>
            <td>
              <button
                @click="handleViewBoard(board.id)"
                class="itbkk-board-name"
              >
                {{ board.name }}
              </button>
            </td>
            <td>
              <span class="text-[#258650]">{{ board.visibility }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div></div>
      <div class="flex flex-col justify-center items-center pt-24">
        <div class="text-3xl drop-shadow-lg p-4 itbkk-collab-board">
          Collab Boards
        </div>

        <!-- Table collab board -->
        <div class="w-full overflow-x-auto">
          <table
            class="table rounded-md overflow-hidden itbkk-table bg-[#39407e] min-w-full"
          >
            <thead>
              <tr class="text-white">
                <th>No.</th>
                <th>Name</th>
                <th>Owner</th>
                <th>Access Right</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody
              v-for="(board, index) in collabBoard"
              :key="index"
              :class="index % 2 === 0 ? 'bg-[#e0e5e2]' : 'bg-[#e8f4f4]'"
              class="text-center border itbkk-item font-lilita"
            >
              <tr class="itbkk-collab-item">
                <td>{{ index + 1 }}</td>
                <td>
                  <button
                    @click="handleViewBoard(board.id)"
                    class="itbkk-board-name text-[#4d5fcb]"
                  >
                    {{ board.name }}
                  </button>
                </td>
                <td>
                  <span class="itbkk-owner-name ">{{
                    board.owner.name
                  }}</span>
                </td>
                <td>
                  <span class="itbkk-access-right">
                    {{
                      board.collaborators.find(
                        (collaborator) => collaborator.oid === oid
                      )?.accessRight || "N/A"
                    }}
                  </span>
                </td>
                <td>
                  <button
                    class="itbkk-leave-board bg-[#adafb5] text-white text-sm py-1 px-2 rounded hover:bg-[#888a94]"
                  >
                    Leave
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- v-else -->
    <!-- <div
      v-else
      class="flex flex-col justify-center items-center text-center gap-4 min-h-screen"
    >
      <img
        src="../../assets/empty-box.png"
        alt="no board"
        class="w-48 h-48 object-cover opacity-90 drop-shadow-xl"
      />
      <span class="text-xl italic text-[#838395]">No Board!</span>
      <span class="text-base text-[#8f8f96]"
        >You don't have any board, Please Create your first board.</span
      >
      <button
        @click="handleAddBoard"
        class="itbkk-button-create bg-[#2b4483] m-2 text-white text-sm py-2 px-2 rounded drop-shadow-xl hover:bg-[#4d5fcb]"
      >
        Create New Board
      </button>
    </div> -->
  </div>
  <!-- </div> -->
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

.table-auto {
  min-width: 70%;
}
.table thead th {
  width: 180px;
  min-width: 190px;
  text-align: center;
}

.table tbody td {
  min-width: 150px;
}

thead th {
  padding: 10px;
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

  .itbkk-button-add:disabled {
    color: #665f5f;
    cursor: not-allowed;
  }
  .text-3xl {
    font-size: 24px;
  }
  .createBtn:disabled {
    color: #665f5f;
    cursor: not-allowed;
  }
}
</style>
