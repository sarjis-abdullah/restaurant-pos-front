<template>
  <BaseSelect :options="options" v-model="selectedItem" :loading="loading" />
</template>

<script setup>
import BaseSelect from "~/components/common/BaseSelect.vue";

const emit = defineEmits([""]);
const options = computed(() =>{
  return [
    {
      id: 1,
      name: "Received",
    },
    {
      id: 2,
      name: "Pending",
    },
    {
      id: 3,
      name: "Ordered",
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
// onMounted(async () => {
//   try {
//     loading.value = true;
//     // await itemStore.fetchList();
//   } catch (error) {
//   } finally {
//     loading.value = false;
//   }
// });
</script>

<style lang="scss" scoped></style>
