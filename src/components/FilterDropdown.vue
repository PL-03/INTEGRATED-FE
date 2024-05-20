<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const selectedOptions = ref([]);
const inputValue = ref("");
const showDropdown = ref(false);
const emit = defineEmits(["filter"]);
const statuses = computed(() => {
  return [...new Set(props.tasks.map((task) => task.status))];
});
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const addOption = (option) => {
  if (option && !selectedOptions.value.includes(option)) {
    selectedOptions.value.push(option);
    inputValue.value = "";
    console.log(selectedOptions.value);
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
  <div class="relative inline-flex items-center">
    <strong>Filter by status:</strong>
    <div
      class="w-64 py-1 px-2 border border-gray-300 rounded-l focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-400"
    >
      <div
        v-for="(option, index) in selectedOptions"
        :key="index"
        class="inline-flex items-center bg-gray-200 rounded-full px-2 py-1 mr-1 mb-1"
      >
        <span>{{ option }}</span>
        <button
          type="button"
          class="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          @click="removeOption(index)"
        >
          <svg
            class="h-3 w-3 fill-current"
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
        class="px-4 py-2 bg-blue-500 text-white rounded-l-none hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <ul class="py-2 text-sm">
          <li
            v-for="(status, index) in statuses"
            :key="index"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click.stop="addOption(status)"
          >
            {{ status }}
          </li>
        </ul>
      </div>
    </div>
    <button
      v-if="selectedOptions.length > 0"
      type="button"
      class="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      @click="clearOptions"
    >
      Clear All
    </button>
  </div>
</template>