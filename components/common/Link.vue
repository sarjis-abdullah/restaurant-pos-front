<template>
  <nuxt-link
    :to="to"
    class="bg-brand-400 text-white hover:bg-brand-500 px-3 py-1 rounded"
  >
    <slot></slot>
  </nuxt-link>
</template>
<script setup>
const props = defineProps({
  to: {
    type: String,
    default: "/",
  },
});
</script>
