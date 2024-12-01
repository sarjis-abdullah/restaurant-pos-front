<template>
  <BaseSelect
    :options="categoryList"
    v-model="selectedBranch"
    :loading="categoryListLoading"
  />
</template>

<script setup>
import BaseSelect from "~/components/common/BaseSelect.vue";
import { useBranchStore } from "~/stores/branch";

const emit = defineEmits(["change"]);
const branchStore = useBranchStore();
const categoryList = computed(() =>
  branchStore?.branches?.length ? branchStore.branches : []
);
const categoryListLoading = ref(false);

const selectedBranch = computed({
  get: () => branchStore.selectedBranch,
  set: (value) => branchStore.setSelectedBranch(value),
});
watch(
  () => selectedBranch,
  (newValue, oldValue) => {
    if (newValue != oldValue) {
      emit("update:modelValue", selectedBranch.value);
    }
  }
);
onMounted(async () => {
  try {
    categoryListLoading.value = true;
    await branchStore.fetchList();
  } catch (error) {
  } finally {
    categoryListLoading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
