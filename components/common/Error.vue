<template>
  <ul>
    <li v-for="item in error" :key="item">
      <div class="text-red-500">
        -{{ item?.length ? item.toString() : '' }}
      </div>
    </li>
  </ul>
</template>

<script setup>
defineProps({
    error: {
        type: [Object, null],
        required: true
    }
})
</script>

<style lang="scss" scoped></style>
