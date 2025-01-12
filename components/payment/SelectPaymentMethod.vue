<template>
  <BaseSelect :options="options" v-model="selectedItem" :loading="loading" />
</template>

<script setup>
import BaseSelect from "~/components/common/BaseSelect.vue";

const emit = defineEmits([]);
const options = computed(() =>{
  return [
    {
      id: "bkash",
      name: "Bkash",
    },
    {
      id: "nagad",
      name: "Nagad",
    },
    {
      id: "card",
      name: "Card",
    }
  ]
}
);
const loading = ref(false);

const selectedItem = ref('');
watch(
  () => selectedItem,
  (newValue, oldValue) => {
    if (newValue != oldValue) {
      emit("update:modelValue", selectedItem.value);
    }
  }
);
</script>

<style lang="scss" scoped></style>
