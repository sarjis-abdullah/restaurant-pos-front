<script setup>
import { onMounted } from "vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import Loading from "@/components/common/Loading.vue";
import { BranchService } from "@/services/BranchService.js";  // Adjusted to BranchService
import { TrashIcon } from "@heroicons/vue/20/solid";
import Titlebar from "@/components/common/Titlebar.vue";

definePageMeta({
  layout: "auth-layout",
});

const branches = ref([]);  // Changed 'users' to 'branches'
const loadingError = ref(null);
const isLoading = ref(true);
const serverErrors = ref(null);

// Pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);

const searchQuery = computed(() => {
  return `?page=${page.value}&per_page=${perPage.value}`;  // Adjusted query if needed
});

const loadData = async () => {
  try {
    isLoading.value = true;
    const { meta, data } = await BranchService.getAll(searchQuery.value);  // Adjusted to BranchService
    branches.value = data;
    console.log(meta, meta.current_page);

    page.value = meta.current_page;
    lastPage.value = meta.last_page;
    total.value = meta.total;
    totalPerPage.value = data.length;

    serverErrors.value = {};
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isLoading.value = false;
  }
};

const isDeleting = ref(false);
const deleteRecord = async (id) => {
  if (confirm("Are you sure to delete this branch?")) {  // Adjusted confirmation message
    try {
      isDeleting.value = true;
      const res = await BranchService.delete(id);  // Adjusted to BranchService
      branches.value = branches.value.filter((item) => item.id != id);

      serverErrors.value = {};
    } catch (error) {
      serverErrors.value = error.errors;
    } finally {
      isDeleting.value = false;
    }
  }
};

const onPageChanged = (p) => {
  page.value = p;
  loadData();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <div class="md:mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <Titlebar title="Branches"></Titlebar>

          <div v-if="!loadingError && !isLoading">
            <table
              class="min-w-full divide-y divide-gray-300"
              v-if="branches && branches?.length > 0"
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Branch Name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Manager
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="branch in branches" :key="branch.id">
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div class="font-medium text-gray-900">
                        {{ branch.name }}
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <span class="text-gray-900">{{ branch.location }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <span>{{ branch.manager }}</span>
                  </td>
                  <td
                    class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
                    <TrashIcon
                      @click="deleteRecord(branch.id)"
                      class="h-5 w-5 mx-auto"
                      aria-hidden="true"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center py-10">
              <p class="text-xl text-gray-400">
                No data available
              </p>
            </div>
          </div>
          <div v-if="!loadingError && isLoading">
            <Loading />
          </div>
          <div v-if="loadingError && !isLoading">
            Loading error
          </div>
        </div>
      </div>
    </div>
    <Loading v-if="isLoading || isDeleting" />
    <Pagination
      class="mt-6"
      :perPage="perPage"
      :lastPage="lastPage"
      :total="total"
      :totalPerPage="totalPerPage"
      @onChange="onPageChanged"
    />
  </div>
</template>
