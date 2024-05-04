<template>
  <div
    v-if="show"
    :class="`fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 rounded-md px-4 py-2 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`"
  >
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ["success", "error"].includes(value),
    },
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    showToast() {
      this.show = true
      setTimeout(() => {
        this.show = false
      }, 5000)
    },
  },
  mounted() {
    this.showToast()
  },
}
</script>
