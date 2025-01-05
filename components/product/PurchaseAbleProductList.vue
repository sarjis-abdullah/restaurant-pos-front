<script setup>
import { onMounted, ref } from "vue";
import Pagination from "@/components/common/Pagination.vue";
import Titlebar from "@/components/common/Titlebar.vue";
import SinglePurchaseAbleItem from "@/components/product/SinglePurchaseAbleItem.vue";
import Loading from "@/components/common/Loading.vue";
import ServerError from "@/components/common/Error.vue";
import SelectMenu from "@/components/menu/SelectMenu.vue";
import { PurchaseService } from "~/services/PurchaseService";
import { usePurchaseStore } from "~/stores/purchase";
import Link from "../common/Link.vue";

const loadingError = ref(null);
const isLoading = ref(true);

const serverErrors = ref(null);

//pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);
const menuId = ref(null);
const searchQuery = computed(() => {
  const include = "&include=purchase.supplier,purchase.payments,purchase.due"
  let query = `?page=${page.value}&per_page=${perPage.value}${include}`;
  if (menuId.value) {
    query += `&menu_id=${menuId.value}`;
  }
  return query;
});
const purchaseStore = usePurchaseStore();
const list = computed(() =>
purchaseStore?.cartProducts?.length ? purchaseStore.cartProducts : []
);

const loadData = async () => {
  try {
    isLoading.value = true;
    const { meta, data } = await PurchaseService.getAll(searchQuery.value);
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
// const updateList = (item) => {
//   list.value = list.value.map((i) => {
//     if (i.id == item.id) {
//       return item;
//     }
//     return i;
//   });
// };

// const onPageChanged = (p) => {
//   page.value = p;
//   // loadData();
// };
// watch(
//   [searchQuery],
//   ([newsearchQuery], [prevsearchQuery]) => {
//     if (newsearchQuery != prevsearchQuery) {
//       loadData();
//     }
//   },
//   {
//     immediate: true,
//     deep: true,
//   }
// );
// watch(
//   () => searchQuery,
//   (newValue, oldValue) => {
//     if (newValue != oldValue) {
//       loadData();
//     }
//   },
//   {
//     immediate: true,
//     deep: true,
//   }
// );
onMounted(() => {
  // loadData();
});
</script>
<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <div class="flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          
          <div class="relative">
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
                    S/N
                  </th>
                  <th
                    scope="col"
                    class="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Barcode
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    SKU
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                  Purchase price
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                  Selling price
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Vat (%)
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Discount
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Expire date
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Subtotal
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Profit (%)
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <SinglePurchaseAbleItem
                  v-for="(singleData, index) in list"
                  :key="singleData.id"
                  :singleData="{...singleData, index}"
                />
              </tbody>
            </table>
            <div v-else class="text-center py-10">
              <p class="text-xl text-gray-400">No data available</p>
            </div>
          </div>
          <!-- <div v-if="!loadingError && isLoading">
            <Loading />
          </div>
          <div v-if="loadingError && !isLoading">
            Loading error
          </div> -->
        </div>
      </div>
    </div>
    <!-- <ServerError :error="serverErrors" />
    <Pagination
      class="mt-6"
      :perPage="perPage"
      :lastPage="lastPage"
      :total="total"
      :totalPerPage="totalPerPage"
      @onChange="onPageChanged"
    />
    <Loading v-if="isLoading" /> -->
  </div>
</template>
