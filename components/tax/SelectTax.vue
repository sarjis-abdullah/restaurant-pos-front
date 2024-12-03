<template>
  <BaseSelect :options="updatedOptions" v-model="selectedItem" :loading="loading" />
</template>

<script setup>
import BaseSelect from "~/components/common/BaseSelect.vue";
import { useTaxStore } from "~/stores/tax";

const emit = defineEmits([""]);
const itemStore = useTaxStore();
const options = computed(() =>
  itemStore?.items?.length ? itemStore.items : []
);
const updatedOptions = computed(()=> {
  return options?.value.map(i=> {
    return {
      ...i,
      name: i.modifiedName,
    }
  })
})

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
