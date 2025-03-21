<template>
    <BaseSelect :options="options" v-model="selectedItem" :loading="loading" />
  </template>
  
  <script setup>
  import BaseSelect from "~/components/common/BaseSelect.vue";
  import { useBranchStore } from '~/stores/branch';
  
  // Initialize the store
  const emit = defineEmits([""]);
  const branchStore = useBranchStore();  // Using branchStore instead of itemStore
  
  // Use branches from the store as options
  const options = computed(() =>
    branchStore?.branches?.length ? branchStore.branches : []
  );
  
  const loading = ref(false);
  
  // Bind selectedItem to the store's selectedBranch
  const selectedItem = computed({
    get: () => branchStore.selectedBranch,  // Get selected branch from store
    set: (value) => branchStore.setSelectedBranch(value),  // Set selected branch in store
  });
  
  // Watch for changes in selectedItem to emit updates
  watch(
    () => selectedItem,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        emit("update:modelValue", selectedItem.value);
      }
    }
  );
  
  // Fetch list of branches when component is mounted
  onMounted(async () => {
    try {
      loading.value = true;
      await branchStore.fetchList();  // Fetch branches from store
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    } finally {
      loading.value = false;
    }
  });
  </script>
  
  <style lang="scss" scoped></style>
  