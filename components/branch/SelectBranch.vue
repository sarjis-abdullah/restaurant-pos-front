<template>
  <BaseSelect :options="categoryList" v-model="selectedBranch" :loading="categoryListLoading" />
</template>

<script setup>
import BaseSelect from "~/components/common/BaseSelect.vue";
import { useBranchStore } from '~/stores/branch';

const branchStore = useBranchStore();
const categoryStore = useCategoryStore();
const categoryList = computed(() =>
  categoryStore?.categories?.length ? categoryStore.categories : []
);
const categoryListLoading = ref(false);

const selectedBranch = computed({
  get: () => branchStore.selectedBranch,
  set: (value) => branchStore.setSelectedBranch(value),
});
onMounted(async () => {
  categoryListLoading.value = true;
  await categoryStore.fetchCategories();
  categoryListLoading.value = false;
});
</script>

<style lang="scss" scoped></style>
