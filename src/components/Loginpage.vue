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
    // const requestData = {
    //   userName: loginInfo.value.userName.trim(),
    //   password: loginInfo.value.password.trim(),
    // };
    // if (requestData.userName.length > 50 || requestData.password.length > 14) {
    //   showToast("Username or Password is incorrect.", "error");
    //   return;
    // }

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

      router.push({ name: "tasklist" });
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
  <div class="flex items-center justify-center min-h-screen bg-[#3e3e44]">
    <div
      class="bg-[#141226] shadow-inner shadow-[#474974] rounded-2xl w-4/5 h-96 md:w-6/12 flex flex-col md:flex-row items-center justify-center gap-2 font-lilita fixed p-4 md:p-0"
    >
      <div
        class="w-full md:w-5/12 h-auto md:h-72 bg-[#fffc9c] ml-4 md:ml-4 mr-0 md:mr-14 rounded-2xl shadow-inner shadow-[#373636] flex items-center justify-center mt-4 md:mt-0"
      >
        <div class="text- m-0 md:m-4">
          <h1 class="text-xl md:text-4xl mb-2 text-[#313175]">Welcome To</h1>
          <h2 class="text-lg md:text-2xl text-[#75483b]">IT - Bangmod</h2>
          <h2 class="text-lg md:text-2xl text-[#75483b]">Kradan Kanban</h2>
        </div>
      </div>

      <div class="w-full md:w-auto mt-4 md:mt-0 mr-0 md:mr-4">
        <div class="flex flex-col items-center md:items-start gap-3">
          <svg
            class="ml-24"
            xmlns="http://www.w3.org/2000/svg"
            width="72"
            height="72"
            viewBox="0 0 24 24"
          >
            <path
              fill="#ffffff"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 
              4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6m0 
              14c-2.03 0-4.43-.82-6.14-2.88a9.95 9.95 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20"
            />
          </svg>
          <div class="flex flex-col items-center md:items-start gap-1 w-full">
            <label for="username" class="text-white text-sm">USERNAME</label>
            <input
              v-model="loginInfo.userName"
              maxlength="50"
              type="text"
              class="bg-white w-full md:w-72 h-9 rounded-lg py-2 px-3 itbkk-username"
              placeholder="Enter your username"
            />
          </div>
          <div class="flex flex-col items-center md:items-start gap-1 w-full">
            <label for="password" class="text-white text-sm">PASSWORD</label>
            <input
              v-model="loginInfo.password"
              type="password"
              maxlength="14"
              id="password"
              class="bg-white w-full md:w-72 h-9 rounded-lg py-2 px-2 itbkk-password"
              placeholder="Enter your password"
            />
          </div>

          <button
            :disabled="!isFormValid"
            :class="{ disabled: !isFormValid }"
            type="submit"
            class="itbkk-button-signin w-full md:w-8/12 h-9 mt-4 ml-0 md:ml-12 bg-[#fffc9c] rounded-xl text-[#75483b] text-lg"
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
</style>
