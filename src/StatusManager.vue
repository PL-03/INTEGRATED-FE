<script setup>
import StatusTable from "./components/StatusTable.vue"
import { useRoute, useRouter } from "vue-router"


const router = useRouter()

const fetchStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v2/statuses`)
      const data = await response.json()
      tasks.value = data
    //   console.log(tasks.value)
    } catch (error) {
      console.error("Error fetching statuses:", error)
    }
  }


</script>

<template>
    <StatusTable
    :statuses="statuses"
    
    
  />
</template>