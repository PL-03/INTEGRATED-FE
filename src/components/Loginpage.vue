<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast, POSITION } from "vue-toastification";
import VueJwtDecode from "vue-jwt-decode";
const router = useRouter();

// password and username
// const username = ref("");
// const password = ref("");
const loginInfo = ref({
  userName: "",
  password: "",
});

const isFormValid = computed(() => {
  return (
    loginInfo.value.userName.trim() !== "" &&
    loginInfo.value.password.trim() !== ""
  );
});
const handleSignIn = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo.value),
    });
    if (response.ok) {
      const data = await response.json();
      const token = data.access_token;
      localStorage.setItem("jwtToken", token);
      // const boardResponse = await fetch(
      //   `${import.meta.env.VITE_BASE_URL}/boards`,
      //   {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      // if (boardResponse.ok) {
      //   const boardData = await boardResponse.json();
      //   console.log(boardData);
      // }

      router.push({ name: "boardslist" });
      showToast("Successfully signed in!", "success-login");
    } else if (response.status === 401) {
      const data = await response.json();
      const message = data.message;
      showToast(message, "error");
    }
  } catch (error) {
    console.error(error);
  }
};
const showToast = (message, type) => {
  const toast = useToast();

  switch (type) {
    case "success-login":
      toast.success(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
        bodyClassName: "itbkk-message",
      });
      break;
    case "error":
      toast.error(message, {
        position: POSITION.TOP_CENTER,
        timeout: 3000,
        bodyClassName: "itbkk-message",
      });
      break;
    default:
      toast(message);
  }
};
</script>

<template>
  <!-- ----------------------Login Page-------------------------------- -->
  <div
    class="allBG background flex flex-col md:flex-row min-h-screen font-lilita"
  >
    <!-- bg-gradient-to-b from-[#3e3e44] to-[#f8f8f7] md:bg-gradient-to-r from-[#3e3e44] to-[#f8f8f7] -->

    <div
      class="hidden md:flex mt-2 items-center justify-center w-full md:w-3/5 p-2"
    >
      <div class="text-center md:text-left">
        <h1
          class="text-4xl md:text-6xl mb-2 text-center text-black animate-bounce"
        >
          Welcome
        </h1>
        <!-- <p class="text-md md:text-2xl text-[#fff8ad]">IT - Bangmod Kradan Kanban</p> -->
        <p class="text-md md:text-2xl text-[#5d5d5d]">
          IT - Bangmod Kradan Kanban
        </p>
      </div>
    </div>

    <div
      class="flex items-center justify-center w-4/6 md:w-3/5 bg-[#141226] shadow-inner shadow-[#5c5b53] rounded-l-full md:rounded-r-none p-8 md:p-0"
    >
      <div
        class="w-full max-w-sm mx-auto p-8 md:p-0 rounded-2xl md:rounded-none"
      >
        <div class="w-full flex flex-col items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-20 h-20"
            viewBox="0 0 24 24"
          >
            <path
              fill="#ffffff"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 
              4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6m0 
              14c-2.03 0-4.43-.82-6.14-2.88a9.95 9.95 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20"
            />
          </svg>
          <div class="w-full">
            <label
              for="username"
              class="text-white text-sm ml-1 md:ml-10 flex flex-col gap-2 items-start"
              >USERNAME</label
            >
            <input
              v-model="loginInfo.userName"
              maxlength="50"
              type="text"
              class="bg-white w-full md:w-80 h-9 rounded-lg py-2 px-3 itbkk-username"
              placeholder="Enter your username"
            />
          </div>
          <div class="w-full">
            <label
              for=" password"
              class="text-white text-sm ml-1 md:ml-10 flex flex-col gap-2 items-start"
              >PASSWORD</label
            >
            <input
              v-model="loginInfo.password"
              type="password"
              maxlength="14"
              id="password"
              class="bg-white w-full md:w-80 h-9 rounded-lg py-2 px-3 itbkk-password"
              placeholder="Enter your password"
            />
          </div>
          <button
            :disabled="!isFormValid"
            :class="{ disabled: !isFormValid }"
            type="submit"
            class="itbkk-button-signin w-full md:w-48 h-9 mt-4 bg-[#fffb90] hover:bg-[#fffb90] rounded-xl text-[#78544a] text-lg"
            @click="handleSignIn"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.itbkk-button-signin:disabled {
  background: rgb(205, 205, 205);
  color: rgb(146, 145, 145);
  cursor: not-allowed;
}

.allBG {
  background: linear-gradient(
    135deg,
    rgb(198, 227, 255) 5%,
    rgb(255, 248, 204) 40%,
    #d2d2d2 70%
  );
}

@media (max-width: 767px) {
  .p-8 {
    padding: 1rem;
  }

  .rounded-l-full {
    border-radius: 1rem;
    margin: 2rem;
  }

  .flex {
    flex-direction: column;
    /* จัดเรียงเป็นแนวตั้งสำหรับจอเล็ก */
    align-items: center;
    /* จัดให้อยู่ตรงกลางตามแนวแกนแนวตั้ง */
    justify-content: center;
    /* จัดให้อยู่ตรงกลางตามแนวแกนแนวนอน */
  }

  .hidden.md\:flex {
    display: inline-block;
    text-align: center;
  }
}
</style>
