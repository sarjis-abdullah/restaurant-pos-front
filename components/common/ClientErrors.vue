<template>
    <div class="text-red-500" v-for="(err, index) in errors" :key="index">
    {{ err?.$message }}
  </div>
</template>

<script setup>
defineProps({
    errors: {
        type: [Array],
        default: null
    }
})
</script>

<style scoped>

</style>