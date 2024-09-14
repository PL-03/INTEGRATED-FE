<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
</script>

<template>
    <!-- bg-gradient-to-t from-gray-500 to-blue-100 -->
    <div class=" bg-[#dfe0e2] min-h-screen font-lilita">
        <nav class="navbar h-20 flex justify-between  fixed left-0 right-0 top-0 z-10 shadow-md shadow-[#95999ad8]">
            <!-- shadow-md bg-gradient-to-t from-blue-100 via-blue-300 to-blue-900 shadow-[#5d5d5fc7] bg-[#eaeef2]-->
            <div class="image flex h-14 m-2">
                <img class="ml-4" src="https://www.sit.kmutt.ac.th/wp-content/uploads/2016/12/logo-kmutt.png" />
                <h1 class="text-start text-2xl font-lilita p-4 text-black tracking-wide">
                    IT-Bangmod Kradan Kanban
                </h1>
            </div>

            <div class="flex m-4 items-center space-x-6">
                <button class="flex items-center text-md text-black hover:text-blue-600 transition duration-300">
                    New Board
                </button>

                <button @click="handleAddTask"
                    class="flex items-center text-md text-black hover:text-blue-600 transition duration-300">
                    Add Task
                </button>

                <button @click="handleStatusList"
                    class="flex items-center text-md text-black hover:text-blue-600 transition duration-300">
                    Manage Status
                </button>

                <div class="relative text-black">
                    <button @click="toggleDropdown" class="flex items-center hover:text-[#4d5fcb]">
                        <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6m0 14c-2.03 0-4.43-.82-6.14-2.88a9.95 9.95 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20" />
                        </svg>
                        {{ username }}
                        <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                            </path>
                        </svg>
                    </button>

                    <div v-if="showDropdown" class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2">
                        <ul>
                            <li><button @click="logout"
                                    class="block w-full text-center px-4 py-2 hover:text-[#ba493f]">Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>


        <div class="flex justify-center p-32">
            <!-- v-if -->
            <!-- no board -->
            <div>
                <div
                    class="flex justify-center items-center text-center gap-4 text-3xl drop-shadow-lg italic text-gray-500">
                    No
                    Board</div>
            </div>

            <!-- v-else -->
            <!-- have board -->
            <!-- <div class="flex justify-center items-center text-center gap-4 text-3xl drop-shadow-lg">Board 
        <p class="text-[#ffeba1]">
          {{ username }}
        </p>
      </div> -->
        </div>
    </div>

</template>

<style scoped>
.navbar {
    background: linear-gradient(135deg, rgb(252, 255, 219) 20%, rgb(152, 217, 255)40%, rgb(255, 221, 216) 100%);
}
</style>