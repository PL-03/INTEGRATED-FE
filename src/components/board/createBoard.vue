<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast, POSITION } from "vue-toastification";
import {
  isTokenExpired,
  decodedToken,
  removeTokens,
} from "@/services/tokenService";
import VueJwtDecode from "vue-jwt-decode";

const props = defineProps({
  boards: {
    type: Array,
    required: true,
  },
});
const showDropdown = ref(false);
const router = useRouter();
// const token = getToken();
const username = ref("");
const oid = ref("");
const emit = defineEmits(["board-added"]);
const tokenDecoded = ref({});
// const decodedToken = () => {
//   const token = localStorage.getItem("jwtToken");
//   if (!token || isTokenExpired(token)) {
//     removeTokens();
//     router.push({ name: "login" });
//     return;
//   } else if (token) {
//     const decodedToken = VueJwtDecode.decode(token);
//     username.value = decodedToken.name;
//     oid.value = decodedToken.oid;
//     // console.log("Username is: ", username.value);
//   }
// };
onMounted(() => {
  tokenDecoded.value = decodedToken();
  username.value = tokenDecoded.value.name;
  oid.value = tokenDecoded.value.oid;
});

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
          class="flex items-center text-md text-black hover:text-blue-600 transition duration-300 itbkk-button-add"
          @click="handleAddBoard"
        >
          Create New Board
        </button>

        <!-- <button @click="handleAddTask"
                    class="flex items-center text-md text-black hover:text-blue-600 transition duration-300">
                    Add Task
                </button> -->

        <!-- <button @click="handleStatusList"
          class="flex items-center text-md text-black hover:text-blue-600 transition duration-300">
          Manage Status
        </button> -->

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
                    src="/public/SignOut.png"
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
    <div
      v-if="boards.length !== 0"
      class="flex flex-col justify-center items-center p-28"
    >
      <div class="text-3xl drop-shadow-lg p-4">
        Board <span class="text-[#2b4483] ml-2">{{ username }}</span>
      </div>

      <table
        class="table-auto w-full max-w-5xl rounded-2xl overflow-hidden itbkk-table bg-green-300"
      >
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody
          v-for="(board, index) in boards"
          :key="index"
          :class="index % 2 === 0 ? 'bg-yellow-50' : 'bg-orange-100'"
          class="text-center border itbkk-item font-lilita"
        >
          <tr>
            <td>{{ index + 1 }}</td>
            <td>
              <button @click="handleViewBoard(board.id)">
                {{ board.name }}
              </button>
            </td>
            <td><button>Edit</button><button>Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- v-else -->
    <div
      v-else
      class="flex flex-col justify-center items-center text-center gap-4 min-h-screen"
    >
      <img
        src="/empty-box.png"
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

.table-auto {
  min-width: 70%;
}

thead th {
  padding: 12px;
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
}
</style>
