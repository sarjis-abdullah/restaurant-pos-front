<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import Titlebar from "@/components/common/Titlebar.vue";
import { CompanyService } from "@/services/CompanyService.js";
import { TrashIcon,PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/vue/20/solid";
import Loading from "@/components/common/Loading.vue";
import ServerError from "@/components/common/Error.vue";
import DeleteModal from "~/components/DeleteModal.vue";

definePageMeta({
  layout: "auth-layout",
});

const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";

const list = ref([]);
const loadingError = ref(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const serverErrors = ref(null);

// Pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);

const searchQuery = computed(() => {
  return `?page=${page.value}&per_page=${perPage.value}`;
});

const loadData = async () => {
  try {
    isLoading.value = true;
    const { meta, data } = await CompanyService.getAll(searchQuery.value);
    list.value = data;

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
      isDeleting.value = true;
      await CompanyService.delete(selectedItemId.value);
      list.value = list.value.filter((item) => item.id !== selectedItemId.value);
      serverErrors.value = {};
    } catch (error) {
      serverErrors.value = error.errors;
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }
};

// Editing logic
const record = reactive({
  id: "",
  name: "",
});

const editRecord = (props) => {
  record.id = props.id;
  record.name = props.name;
  list.value = list.value.map((item) => ({
    ...item,
    editMode: item.id === props.id,
  }));
};

const isUpdating = ref(false);
const updateableRecord = computed(() => ({
  name: record.name,
}));

const cancelUpdatingRecord = () => {
  list.value = list.value.map((item) => ({
    ...item,
    editMode: false,
  }));
};

const updateRecord = async (id) => {
  try {
    isUpdating.value = true;
    const res = await CompanyService.put(id, updateableRecord.value);
    list.value = list.value.map((item) =>
      item.id === id ? { ...item, name: record.name, editMode: false } : item
    );
    serverErrors.value = {};
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isUpdating.value = false;
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
          <Titlebar title="Company"></Titlebar>

          <div v-if="!loadingError && !isLoading">
            <table v-if="list.length > 0" class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th class="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th class="relative py-3.5 pl-3 pr-4 sm:pr-0">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="singleData in list" :key="singleData.id">
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div>
                        <div v-if="singleData.editMode">
                          <input
                            :class="inputClass"
                            v-model="record.name"
                            type="text"
                            placeholder="e.g. Company name"
                          />
                        </div>
                        <div v-else class="font-medium text-gray-900">
                          {{ singleData.name }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="flex justify-center gap-1 whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <PencilIcon
                      @click="editRecord(singleData)"
                      class="h-5 w-5 cursor-pointer text-blue-500"
                      aria-hidden="true"
                    />
                    <CheckIcon
                      v-if="singleData.editMode"
                      @click="updateRecord(singleData.id)"
                      class="h-5 w-5 text-green-500 cursor-pointer"
                      aria-hidden="true"
                    />
                    <XMarkIcon
                      v-if="singleData.editMode"
                      @click="cancelUpdatingRecord"
                      class="h-5 w-5 text-gray-500 cursor-pointer"
                      aria-hidden="true"
                    />
                    <button
                      @click="openDeleteModal(singleData.id)"
                      class="text-red-500 hover:text-red-700"
                    >
                     <TrashIcon  class="h-5 w-5"/>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center py-10">
              <p class="text-xl text-gray-400">No data available</p>
            </div>
          </div>

          <div v-if="isLoading"><Loading /></div>
          <div v-if="loadingError">Loading error</div>
        </div>
      </div>
    </div>

    <ServerError :error="serverErrors" />
    <Loading v-if="isLoading || isDeleting || isUpdating" />
    <Pagination
      class="mt-6"
      :perPage="perPage"
      :lastPage="lastPage"
      :total="total"
      :totalPerPage="totalPerPage"
      @onChange="onPageChanged"
    />

    <!-- Global Delete Modal -->
    <DeleteModal :isOpen="showDeleteModal" @confirm="confirmDelete" @close="closeDeleteModal" />
  </div>
</template>
