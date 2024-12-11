<script setup>
import { useRouter } from "vue-router"
const router = useRouter()
const goBack = () => {
  router.push({ name: "boardslist" })
}
</script>

<template>
  <div class="allBG text-center min-h-screen font-lilita">
    <div class="modal-overlay">
      <div class="modal-content shadow-lg shadow-[#87898bd8]">
        <p class="text-2xl text-[#644e44] tracking-wider mt-2">Invitation Not Found</p>
        <div class="flex flex-col items-center">
          <img
            src="../assets/error.gif"
            alt="Invite"
            width="96"
            height="96"
            class="my-4"
          />
        </div>
        <div>
          <p class="text-base text-left text-black p-2 mb-6">
            We’re <span class="font-bold text-red-600">sorry</span> 
            , but we could not locate your active invitation. Please ensure you are using a valid link or try again later.
            
          </p>
        </div>
        <button
          @click="goBack"
          class="bg-[#4ae77c] hover:bg-[#4cdb79] text-black mt-2 w-32 h-10 rounded"
        >
          Home
        </button>
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
