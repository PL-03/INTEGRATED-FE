<script setup>
import { useRouter } from "vue-router"

const emit = defineEmits(["statusList"])
const router = useRouter()

const closeStatusPage = () => {
//   emit("update:show", false)
  router.push("/task")
}


</script>

<template>
    <div class="Status-content">
        <div>
            <h1 class="text-5xl font-bold p-8">IT-Bangmod Kradan Kanban</h1>
        </div>
        <div class="mt-2 grid grid-cols-2 items-center ">
            <div class="flex justify-start ">
                <button @click="closeStatusPage" class="ml-48 mt-2 font-bold p-2 rounded itbkk-button-home">
                    <strong class="text-blue-600">Home</strong>
                </button>
                <strong class="text-gray-500 mt-4 ml-2"> > </strong>
                <strong class="text-black mt-4 ml-4">Task Status</strong>

            </div>
            <div class="flex justify-end">
                <button class="mr-48 mt-2 bg-green-700 hover:bg-green-700 text-white font-bold p-2 rounded itbkk-button-add">
                    Add status
                </button>
            </div>
        </div>
        <div class="mt-4 flex justify-center items-center">
            <table class="table-auto w-9/12 m-2 rounded-2xl overflow-hidden">
                <thead class="bg-blue-950 border-b py-4 text-white">
                    <tr>
                        <th class="text-lg font-medium text-white px-4 py-2 text-left border-r">
                            #
                        </th>
                        <th class="text-lg font-medium text-white px-4 py-2 text-left border-r">
                            Name
                        </th>
                        <th class="text-lg font-medium text-white px-4 py-2 text-left border-r">
                            Description
                        </th>

                        <th class="text-lg font-medium text-white px-4 py-2 text-left">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="itbkk-item font-mono border-b">

                        <td class="itbkk-status-name">

                        </td>
                        
                        <td class="itbkk-status-drescription">

                        </td>

                        <!-- <td class="px-4 py-2">
                            <button class="text-purple-600 hover:text-purple-400 mb-2 mt-2 itbkk-button-edit">
                                Edit
                            </button>
                            <button class="text-red-600 hover:text-red-400 itbkk-button-delete">
                                Delete
                            </button>
                        </td> -->
                    </tr>

                </tbody>
            </table>
        </div>


    </div>

</template>