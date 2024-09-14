<script setup>
import { onMounted, ref, watch } from "vue";
import { isTokenExpired } from "../../libs/util";

const getToken = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token || isTokenExpired(token)) {
    isTokenValid.value = false;
    localStorage.removeItem("jwtToken");
    alert("Your session has expired. Please login again.");
    router.push({ name: "login" });
    return null;
  }
  return token;
};
const fetchStatus = async () => {
  const token = getToken();
  if (!token) return;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v2/statuses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    statuses.value = await response.json();
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
  <div class="relative flex ml-28">
    <div
      class="itbkk-status-filter flex w-72 h-11 px-4 bg-white rounded-l-lg border-gray-300 rounded-l focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-400 overflow-x-scroll"
    >
      <div
        class="itbkk-filter-item mt-2 mb-1 whitespace-nowrap text-gray-500 text-sm"
      >
        <p class="">Filter by status :</p>
      </div>

      <div
        v-for="(option, index) in selectedOptions"
        :key="index"
        class="itbkk-filter-item m-2 flex items-center text-sm bg-gray-300 rounded-full px-3 py-3 mt-2 text-sm whitespace-nowrap"
      >
        <span>{{ option }}</span>
        <button
          type="button"
          class="itbkk-filter-item ml-1 text-gray-500 hover:text-red-700 focus:outline-none"
          @click="removeOption(index)"
        >
          <svg
            class="itbkk-filter-item-clear h-3 w-3 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="relative">
      <button
        class="h-11 px-4 py- rounded-r-lg bg-blue-500 text-white rounded-l-none hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        @click="toggleDropdown"
      >
        <svg
          class="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
          />
        </svg>
      </button>
      <div
        v-if="showDropdown"
        class="absolute left-0 z-10 mt-2 bg-white rounded-lg shadow-lg"
        @click="filter"
      >
        <ul class="itbkk-status-choice py-2 text-sm">
          <li
            v-for="(status, index) in statuses"
            :key="index"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click.stop="addOption(status)"
          >
            {{ status.name }}
          </li>
        </ul>
      </div>
    </div>
    <button
      v-if="selectedOptions.length > 0"
      type="button"
      class="itbkk-filter-clear ml-2 mt-3 h-8 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      @click="clearOptions"
    >
      Clear All
    </button>
  </div>
</template>
