<template>
  <BaseSelect :options="options" v-model="selectedItem" :loading="loading" />
</template>

<script setup>
import BaseSelect from "~/components/common/BaseSelect.vue";
import { useCategoryStore } from "~/stores/category";

const emit = defineEmits([""]);
const itemStore = useCategoryStore();
const options = computed(() =>
  itemStore?.items?.length ? itemStore.items : []
);
const loading = ref(false);

const selectedItem = computed({
  get: () => itemStore.selectedItem,
  set: (value) => itemStore.setSelectedItem(value),
});
watch(
  () => selectedItem,
  (newValue, oldValue) => {
    if (newValue != oldValue) {
      emit("update:modelValue", selectedItem.value);
    }
  }
);
onMounted(async () => {
  try {
    loading.value = true;
    await itemStore.fetchList();
  } catch (error) {
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
