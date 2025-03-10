<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <div class="md:mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <Titlebar title="branch"></Titlebar>

          <div v-if="!loadingError && !isLoading">
            <table class="min-w-full divide-y divide-gray-300" v-if="branches.length > 0">
              <thead>
                <tr>
                  <th class="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Company ID</th>
                  <th class="relative py-3.5 pl-3 pr-4 sm:pr-0">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="branch in branches" :key="branch.id">
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-900">{{ branch.name }}</td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-900">{{ branch.type }}</td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-900">{{ branch.company_id }}</td>
                  <td class="flex justify-center gap-1 relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <TrashIcon
                      @click="openDeleteModal(branch.id)"
                      class="h-5 w-5 text-red-500 cursor-pointer"
                      aria-hidden="true"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center py-10">
              <p class="text-xl text-gray-400">No branches found</p>
            </div>
          </div>

          <div v-if="isLoading" class="text-center py-10">
            <Loading />
          </div>

          <div v-if="loadingError" class="text-center py-10 text-red-500">
            Failed to load branches.
          </div>
        </div>
      </div>
    </div>

    <ServerError :error="serverErrors" />

    <Pagination
      class="mt-6"
      :perPage="perPage"
      :lastPage="lastPage"
      :total="total"
      :totalPerPage="totalPerPage"
      @onChange="onPageChanged"
    />
    <Loading v-if="isLoading || deleting" />
    <!-- Global Delete Modal -->
    <DeleteModal :isOpen="showDeleteModal" @confirm="confirmDelete" @close="closeDeleteModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { BranchService } from "@/services/BranchService";
import Titlebar from "@/components/common/Titlebar.vue";
import Pagination from "@/components/common/Pagination.vue";
import Loading from "@/components/common/Loading.vue";
import ServerError from "@/components/common/Error.vue";
import { TrashIcon } from "@heroicons/vue/20/solid";
import DeleteModal from "~/components/DeleteModal.vue";
// Page meta
definePageMeta({
  layout: "auth-layout",
});

// Reactive state
const branches = ref([]);
const loading = ref(true);
const loadingError = ref(false);
const message = ref("");
const deleting = ref(false);
const serverErrors = ref({}); // Declare the serverErrors variable here

// Pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);

const searchQuery = computed(() => {
  return `?page=${page.value}&per_page=${perPage.value}`;
});

// Fetch branches when the component is mounted
onMounted(() => {
  fetchBranches();
});

async function fetchBranches() {
  try {
    loading.value = true;
    const response = await BranchService.getAll(searchQuery.value);
    branches.value = Array.isArray(response.data) ? response.data : [];

    const { meta } = response;
    page.value = meta.current_page;
    lastPage.value = meta.last_page;
    total.value = meta.total;
    totalPerPage.value = branches.value.length;
  } catch (err) {
    loadingError.value = true;
    console.error("Error loading branches:", err);
  }
  loading.value = false;
}

// Delete Modal Logic
const showDeleteModal = ref(false);
const selectedItemId = ref(null);

const openDeleteModal = (id) => {
  selectedItemId.value = id;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedItemId.value = null;
};

const confirmDelete = async () => {
  if (selectedItemId.value) {
    try {
      deleting.value = true;
      await BranchService.delete(selectedItemId.value); // Use the BranchService for deleting
      branches.value = branches.value.filter((item) => item.id !== selectedItemId.value);
      serverErrors.value = {}; // Clear server errors after successful deletion
    } catch (error) {
      serverErrors.value = error.errors || {}; // Set server errors if the delete fails
    } finally {
      deleting.value = false;
      closeDeleteModal();
    }
  }
};

const onPageChanged = (p) => {
  page.value = p;
  fetchBranches();
};
</script>


<style scoped>
button:hover {
  opacity: 0.8;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
