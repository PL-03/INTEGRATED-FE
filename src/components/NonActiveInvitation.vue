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
    <h1 class="text-xl text-white">
      Sorry we cloud not find your
      <span class="font-bold text-red-600">active</span>
      invitation.
    </h1>
    <button
      @click="goBack"
      class="bg-[#4ae77c] hover:bg-[#4cdb79] text-black w-32 h-10 rounded"
    >
      Home
    </button>
  </div>
</template>

<style scoped></style>
