<script setup>
import { PurchaseService } from "~/services/PurchaseService";
import { usePayments } from "~/hooks/usePayments";

definePageMeta({
  layout: "auth-layout",
});

const route = useRoute();
const routeQuery = computed(() => {
  return route.query;
});
const purchaseId = route.params.purchaseId;
const searchQuery = computed(() => {
  const include =
    "?include=purchase.supplier,purchase.payments,purchaseProducts,pp.stock,pp.product";
  return `${purchaseId}${include}`;
});

const purchase = ref({});
const purchaseProducts = ref([]);
const payments = ref([]);
const getSinglePurchase = async () => {
  const response = await PurchaseService.get(searchQuery.value);
  purchase.value = response.data;
  purchaseProducts.value = response.data.purchaseProducts;
  payments.value = response.data.payments;
};

const { totalPaid } = usePayments(payments.value);

watch(
  () => searchQuery,
  (newValue, oldValue) => {
    if (searchQuery.value) {
      getSinglePurchase();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
onMounted(() => {});
</script>
<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div class="mt-3 flex flex-wrap justify-between printDetailsInfo">
          <div>
            <div class="mb-1 text-lg font-medium font-poppins">
              Supplier Info
            </div>
            <div>
              <span>Name: </span>
              <span>{{ purchase?.supplier?.name }}</span>
            </div>
          </div>
          <div>
            <div class="mb-1 text-lg font-medium font-poppins">Branch Info</div>
            <div>RT Shyamoli Branch</div>
            <div>Dhaka, Bangladesh</div>
            <div>01822270506</div>
          </div>
          <div>
            <div class="mb-1 text-lg font-medium font-poppins">
              Reference Info
            </div>
            <div class="text-sm mb-0.5">
              <span>Reference: </span>
              <span>
                {{ purchase?.id }}
              </span>
            </div>
            <div class="mb-1 text-sm">
              <span>Payment Status: </span>
              <span class="px-3 py-0 text-sm capitalize border-2 border-solid rounded border-sky-300 text-sky-400">paid</span>
            </div>
            <div class="text-sm mb-0.5 mt-2 flex flex-row">
              <span class="mr-1">Purchase Status: </span
              ><a
                class="cursor-pointer text-blue-600 px-2 border-2 border-blue-400 border-solid rounded flex flex-row"
                >{{purchase?.status}}<svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  class="h-4 w-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  ></path></svg
              ></a>
            </div>
            <div class="text-sm">
              <span>Date: </span><span>Apr 25, 2024 11:53 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tableData">
      <section class="mt-2">
        <h6 class="font-medium font-poppins">Product Summary:</h6>
        <div class="overflow-hidden sm:rounded-lg">
          <div class="p-0">
            <div class="flex justify-between overflow-hidden">
              <div class=""></div>
            </div>
          </div>
        </div>
        <div class="flex flex-col mt-3">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
            >
              <div class="mb-5 overflow-hidden border rounded-lg">
                <table
                  role="table"
                  class="min-w-full divide-y divide-gray-200 table-auto"
                >
                  <thead class="bg-white divide-y divide-gray-200">
                    <tr role="row" class="divide-x divide-gray-200">
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">Product</div>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">Barcode</div>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">Purchase Qty</div>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">Remaining Qty</div>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">SKU</div>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">Expired Date</div>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">Unit Cost</div>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">Selling Price</div>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">Sub Total</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    role="rowgroup"
                    class="bg-white divide-y divide-gray-200"
                  >
                    <tr
                      v-for="item in purchaseProducts"
                      :key="item.id"
                      role="row"
                      class="divide-x divide-y divide-gray-200 bg-gray-50"
                    >
                      <td role="cell" class="text-left py-3">
                        <p>{{ item.product?.name }}</p>
                        <!-- <p class="text-xs text-orange-400">
                            {{item.product?.description}}
                        </p> -->
                      </td>
                      <td role="cell" class="text-center py-3">
                        {{ item.product?.barcode }}
                      </td>
                      <td role="cell" class="text-center py-3">
                        {{ item.quantity }}
                      </td>
                      <td role="cell" class="text-center py-3">
                        {{ item.stock?.quantity }}
                      </td>
                      <td role="cell" class="text-center py-3">
                        {{ item.stock?.sku }}
                      </td>
                      <td role="cell" class="text-center py-3">-</td>
                      <td role="cell" class="text-center py-3">
                        {{ item.purchase_price }}
                      </td>
                      <td role="cell" class="text-center py-3">
                        {{ item.selling_price }}
                      </td>
                      <td role="cell" class="text-center py-3">
                        {{ item.subtotal }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <h6 class="font-medium font-poppins">Payment Summary:</h6>
        <div class="overflow-hidden sm:rounded-lg">
          <div class="p-0">
            <div class="flex justify-between overflow-hidden">
              <div class=""></div>
            </div>
          </div>
        </div>
        <div class="flex flex-col mt-3">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
            >
              <div class="mb-5 overflow-hidden border rounded-lg">
                <table
                  role="table"
                  class="min-w-full divide-y divide-gray-200 table-auto"
                >
                  <thead class="bg-white divide-y divide-gray-200">
                    <tr role="row" class="divide-x divide-gray-200">
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">Date</div>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">Payment Method</div>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">Paid</div>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 text-sm font-medium tracking-wider text-center capitalize group text-black-500"
                        colspan="1"
                        role="columnheader"
                        title="Toggle SortBy"
                        style="cursor: pointer"
                      >
                        <div class="items-center">Transaction Number</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    role="rowgroup"
                    class="bg-white divide-y divide-gray-200"
                  >
                    <tr
                      role="row"
                      v-for="item in payments"
                      :key="item.id"
                      class="divide-x divide-y divide-gray-200 bg-gray-50"
                    >
                      <td role="cell" class="text-center py-3">
                        {{ item.created_at }}
                      </td>
                      <td role="cell" class="text-center py-3">
                        <span class="capitalize">
                          {{ item.method }}
                        </span>
                      </td>
                      <td role="cell" class="text-center py-3">
                        {{ item.amount }}
                      </td>
                      <td role="cell" class="text-center py-3">
                        {{ item.transaction_id }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-5 mb-8">
          <div>
            <div
              class="flex p-1 odd:bg-slate-200 text-sm bg-slate-200 w-60 mb-1.5"
            >
              <div class="w-28">Grand Total</div>
              <div class="font-medium w-28 text-end">
                ৳ {{ purchase?.total_amount ?? 0 }}
              </div>
            </div>
            <div
              class="flex p-1 even:bg-white text-sm bg-slate-200 w-60 mb-1.5"
            >
              <div class="w-28">Total Payment</div>
              <div class="font-medium w-28 text-end">৳ {{ totalPaid }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="stylus" scoped></style>
