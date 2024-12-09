<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.push({ name: "boardslist" });
};
</script>

<template>
  <div
    class="bg-[#45474c] min-h-screen font-lilita flex flex-col items-center gap-6"
  >
    <img
      src="../assets/access-denied.png"
      alt="Access Denied"
      width="96"
      height="96"
      class="mt-20"
    />
    <h1 class="text-xl text-white">
      Access Denied, you don't have permission to view this page.
    </h1>
    <button
      @click="goBack"
      class="bg-[#4ae77c] hover:bg-[#4cdb79] text-black w-32 h-10 rounded"
    >
      Go Back
    </button>
  </div>
</template>

<style scoped></style>
