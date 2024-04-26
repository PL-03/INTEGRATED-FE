<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
<div class="homepage">
    <h1 class="font-bold text-3xl">Welcome To ITBKK Kradan Kanban Of PL-3 Group!</h1>
</div>
<div class=" mt-8"><router-link to="/task" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >Click Here!</router-link
  ></div>
</template>

<style scoped>

</style>
