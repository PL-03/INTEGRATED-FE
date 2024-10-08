<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  isTokenExpired,
  getToken,
  useRefreshToken,
} from "@/services/tokenService";

const route = useRoute();
const router = useRouter();
const boardId = route.params.boardId;

const fetchStatus = async () => {
  const token = getToken();
  if (!token) {
    await useRefreshToken();
    token = getToken();
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/statuses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      statuses.value = await response.json();
    } else if (response.status === 401) {
      localStorage.removeItem("jwtToken");
      router.push({ name: "login" });
    } else if (response.status === 403) {
      router.push({ name: "denial" });
    }
  } catch (error) {
    console.error("Error fetching statuses:", error);
  }
};
const statuses = ref([]);
onMounted(async () => {
  await fetchStatus();
});

const selectedOptions = ref([]);
const inputValue = ref("");
const showDropdown = ref(false);
const emit = defineEmits(["filter"]);

watch(
  () => statuses,
  (newVal) => {
    console.log("Statuses updated:", newVal); // Log updated statuses
  },
  { immediate: true }
);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const addOption = (option) => {
  if (option && !selectedOptions.value.includes(option.name)) {
    selectedOptions.value.push(option.name);
    inputValue.value = "";
    filter(); // Call the filter function after adding an option
  }
  showDropdown.value = false;
};

const removeOption = (index) => {
  selectedOptions.value.splice(index, 1);
  filter(); // Trigger the filter event after removing an option
};

const clearOptions = () => {
  selectedOptions.value = [];
  emit("filter", []);
};

const filter = () => {
  emit("filter", selectedOptions.value);
};
</script>

<template>
  <div class="">
    <!-- Container สำหรับ Filter by status และปุ่ม Clear All -->
    <div class="flex flex-wrap items-center ">
      <!-- Filter by status -->
      <div class="flex items-center">
        <div v-if="selectedOptions.length > 0" class="text-[#4f4f50] text-sm">
          <p>Filter by status:</p>
        </div>

        <!-- แสดงตัวเลือกที่ถูกเลือก -->
        <div v-for="(option, index) in selectedOptions" :key="index"
          class="flex items-center text-sm bg-[#bfc0c2] rounded-full px-3 h-7 text-sm mx-1">
          <span>{{ option }}</span>
          <button type="button" class="ml-1 text-[#77797a] hover:text-red-700 focus:outline-none"
            @click="removeOption(index)">
            <svg class="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path
                d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- ปุ่ม Clear All -->
      <div v-if="selectedOptions.length > 0" class="flex items-center">
        <button type="button"
          class="ml-8 h-9 px-4 text-sm bg-[#cf362b] text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          @click="clearOptions">
          Clear All
        </button>
      </div>

      <!-- ปุ่ม Filter Status -->
      <div class="relative ">
        <button class="h-9 px-2 ml-1 bg-[#2c62ea] text-sm text-white rounded-lg hover:bg-[#345aba]"
          @click="toggleDropdown">
          Filter Status
        </button>
        <div v-if="showDropdown" class="absolute left-0 z-10 mt-2 bg-white rounded-lg shadow-lg w-48">
          <ul class="py-2 text-sm">
            <li v-for="(status, index) in statuses" :key="index" class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click.stop="addOption(status)">
              {{ status.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
