<script setup>
import { onMounted, reactive, ref } from "vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import { formatDate } from "@/utils/index";
import Titlebar from "@/components/common/Titlebar.vue";

import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";
import Loading from "@/components/common/Loading.vue";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import { AddonService } from "~/services/AddonService";
import SingleAddon from './SingleAddon.vue'
const { menuItemId } = defineProps({
  menuItemId: {
    description: Number,
    required: true,
    default: null,
  },
});
const list = ref([]);
const loadingError = ref(null);
const isLoading = ref(true);
const serverErrors = ref(null);

//pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);

const searchQuery = computed(() => {
  return `?menu_item_id=${menuItemId}&page=${page.value}&per_page=${perPage.value}`;
});

const loadData = async () => {
  try {
    isLoading.value = true;
    const { meta, data } = await AddonService.getAll(searchQuery.value);
    list.value = data;

    page.value = meta.current_page;
    lastPage.value = meta.last_page;
    total.value = meta.total;
    totalPerPage.value = data.length;

    serverErrors.value = {};
    // handleReset();
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isLoading.value = false;
  }
};

const updateList = (item) => {
  console.log(item, 'item');
  list.value = list.value.map((i) => {
    if (i.id == item.id) {
      return item;
    }
    return i;
  });
};
const handleDelete = (id) => {
  list.value = list.value.filter((i) => i.id != id);
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
          <!-- <OrderFilters
          v-if="showFilterButton"
          :title="title"
          :showFilterButton="showFilterButton"
          :pdfLoading="pdfLoading"
          @filterOrderBy="filterOrderBy"
          @downloadOrderStatement="downloadOrderStatement"
        /> -->
          <!-- <Titlebar title="Discount"></Titlebar> -->

          <div v-if="!loadingError && !isLoading">
            <table
              class="min-w-full divide-y divide-gray-300"
              v-if="list && list?.length > 0"
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name/Description
                  </th>
                  <th
                    scope="col"
                    class="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Price
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <SingleAddon v-for="singleData in list" :key="singleData.id" :singleData="singleData" @update:list="updateList" @handle-delete:list="handleDelete">
                </SingleAddon>
              </tbody>
            </table>
            <div v-else class="text-center py-10">
              <p class="text-xl text-gray-400">No data available</p>
            </div>
          </div>
          <div v-if="!loadingError && isLoading">
            <Loading />
          </div>
          <div v-if="loadingError && !isLoading">
            Loading error
            <!-- <ListLoadingError :message="'cant_load_orders_list'" /> -->
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
    <Loading v-if="isLoading" />
  </div>
</template>
