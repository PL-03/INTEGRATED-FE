<script setup>
const fetchData = async () => {
  isLoading.value = true
  const result = await fetch(`http://localhost:8080/itb-kk/v1/tasks/`)
  const response = await result.json()
}

</script>

<template>
    <div><h1 class="text-5xl font-bold" >IT-Bangmod Kradan Kanban</h1></div>
    <div class="mt-4"><button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">+ Add Task</button></div>
  <div class="flex justify-center items-center mt-4">
    <table class="table-auto w-full">
        <thead class="bg-white border-b">
            <tr>
              <th scope="col" class="text-lg font-medium text-gray-900 px-6 py-2 text-left border-r">
                #
              </th>
              <th scope="col" class="text-lg font-medium text-gray-900 px-6 py-2 text-left border-r">
                Title</th>
              <th scope="col" class="text-lg font-medium text-gray-900 px-6 py-2 text-left border-r">
                Assignees</th>
              <th scope="col" class="text-lg font-medium text-gray-900 px-6 py-2 text-left">
                Status</th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-gray-100 border-b">
                <tr class="bg-gray-100 border-b">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">

                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">

                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">

                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r">
                        <button class="">...</button>
                    </td>
                  </tr>
            </tr>

        </tbody>
    </table>
  </div>
</template>

<style scoped>

border-r {
    border-right: 1px solid #e2e8f0;
  }
</style>
