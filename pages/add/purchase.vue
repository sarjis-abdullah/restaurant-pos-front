<script setup>
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseSelect from "@/components/common/BaseSelect.vue";
import SpinnerButton from "@/components/common/SpinnerButton.vue";
import SelectBranch from "@/components/branch/SelectBranch.vue";
import SelectCategory from "@/components/category/SelectCategory.vue";
import SelectTax from "@/components/tax/SelectTax.vue";
import SelectDiscount from "@/components/discount/SelectDiscount.vue";
import SelectSupplier from "@/components/supplier/SelectSupplier.vue";
import SelectPurchaseStatus from "@/components/purchase/SelectPurchaseStatus.vue";
import SelectPurchaseAbleProduct from "@/components/product/SelectPurchaseAbleProduct.vue";
import SelectPaymentMethod from "@/components/payment/SelectPaymentMethod.vue";
import PurchaseAbleProductList from "@/components/product/PurchaseAbleProductList.vue";
import { ref, reactive, onMounted } from "vue";
import { usePurchaseStore } from "~/stores/purchase";


// const {
//   totalCardProducts,
//   totalPurchasePriceAll,
//   totalTaxAll,
//   totalDiscountAll,
//   purchaseSubtotalAll,
//   totalQuantityAll,
// } = purchaseDetails.value;
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import {
  email,
  required,
  sameAs,
  helpers,
  minValue,
} from "@vuelidate/validators";
import { PlaceService } from "@/services/PlaceService.js";
import { SlotService } from "@/services/SlotService.js";
import { CategoryService } from "~/services/CategoryService";
import { TariffService } from "~/services/TariffService";
import { MenuItemService } from "~/services/MenuItemService";
import { PurchaseService } from "~/services/PurchaseService";

definePageMeta({
  layout: "auth-layout",
});
const RECEIVED = "Received";
const UN_AVAILABLE = "unavailable";
const HALF_HOURLY = "half_hourly";
const defaultData = {
  supplier: "",
  branch: "",
  date: "",
  status: RECEIVED,
  shippingCost: 50,
  paymentMethod: "",
  payingAmount: 0,
};


const serverErrors = ref({});
const state = reactive({ ...defaultData });
const purchaseStore = usePurchaseStore();
const purchaseDetails = computed(() => {
  return purchaseStore?.purchaseDetails(state.shippingCost);
});
const totalCardProducts = computed(() => {
  return purchaseDetails.value?.totalCardProducts ?? 0;
});
const allocatedShippingCost = computed(() => {

  if (state.shippingCost > 0 && totalCardProducts.value > 0) {
    return parseFloat(state.shippingCost) / totalCardProducts.value;
    return Number(cost).toFixed(2);
  }


  return 0;
});
const rules = computed(() => {
  return {
    supplier: {
      required: helpers.withMessage("Supplier is required", required),
    },
    branch: { required: helpers.withMessage("Branch is required", required) },
    date: {
      required: helpers.withMessage("Purchase date is required", required),
    },
    status: { required: helpers.withMessage("Status is required", required) },
    shippingCost: {
      required: helpers.withMessage("Shipping cost is required", required),
    },
    paymentMethod: {
      required: helpers.withMessage("Payment method is required", required),
    },
    payingAmount: {
      required: helpers.withMessage("Paying amount is required", required),
    },
  };
});
const validator = useVuelidate(rules, state, { $lazy: true });

const loading = ref(false);

const handleReset = async () => {
  await validator.value.$reset();
  for (let key in state) {
    state[key] = defaultData[key];
  }
  state.status = RECEIVED;
  serverErrors.value = {};
};
const storeData = computed(() => {
  return {
    supplier_id: state.supplier,
    purchase_date: state.date,
    branch_id: state.branch,
    status: state.status,
    shipping_cost: state.shippingCost,
    payment: {
      amount: state.payingAmount,
      method: state.paymentMethod,
    },
    purchaseProducts: purchaseStore?.purchaseProducts(),
  };
});
const postItem = async () => {
  try {
    loading.value = true;
    await PurchaseService.create(storeData.value);

    serverErrors.value = {};
    handleReset();
    state.status = RECEIVED;
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    loading.value = false;
  }
};
const onSubmit = async () => {
  const r = await validator.value.$validate();
  if (r) {
    postItem();
  } else {
    console.log("Please fillup the form!");
  }
};

const notice =
  "This checkbox sets the current tariff plan as the default. Note that only one default tariff plan is allowed at a time. If this tariff plan is selected as default, it will override any existing default tariff plan, and the most recently updated default tariff plan will take precedence.";
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <header class="hidden md:flex justify-between text-gray-900 mb-3 text-xl">
      <h6 class="hidden md:inline-block capitalize">{{ "Add Menu-Item" }}</h6>
    </header>
    <form @submit.prevent="onSubmit" ref="formRef" class="grid gap-3">
      <section class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500">Select supplier</label>
          <SelectSupplier v-model="state.supplier" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Select Branch</label>
          <SelectBranch v-model="state.branch" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Purchase status</label>
          <SelectPurchaseStatus v-model="state.status" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">
            Purchase date<span class="text-red-500">*</span>
          </label>
          <BaseInput v-model="state.date" type="date" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">
            Product name<span class="text-red-500">*</span>
          </label>
          <SelectPurchaseAbleProduct />
        </div>
      </section>
      <section v-if="purchaseDetails?.totalCardProducts > 0" class="grid grid-cols-1 gap-3">
        <PurchaseAbleProductList :allocatedShippingCost="allocatedShippingCost" />
      </section>

      <section class="grid grid-cols-1 md:grid-cols-4 gap-3 mt-8">
        <div class="grid gap-2">
          <label class="text-gray-500">
            Shipping cost<span class="text-red-500">*</span>
          </label>
          <BaseInput v-model="state.shippingCost" type="number" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">
            Payment method<span class="text-red-500">*</span>
          </label>
          <SelectPaymentMethod v-model="state.paymentMethod" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">
            Paying amount<span class="text-red-500">*</span>
          </label>
          <BaseInput v-model="state.payingAmount" type="number" />
        </div>
      </section>
      <section class="mt-4" v-if="purchaseDetails?.totalCardProducts > 0">
        <div class="rounded-md px-4 py-4 bg-gray-100 mt-4">
          <label
            class="block mb-2 text-md font-bold tracking-wide text-gray-700"
            >Purchase Summary</label
          >
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div class="flex">
                <label class="block w-[30%] mb-2 text-sm font-semibold tracking-wide text-gray-700">
                  Total Product:
                </label>
                <p>{{ purchaseDetails?.totalCardProducts }}</p>
              </div>
              <div class="flex">
                <label
                  class="block w-[30%] mb-2 text-sm font-semibold tracking-wide text-gray-700"
                  >Total Product Quantity:</label
                >
                <p>
                  {{ purchaseDetails?.totalQuantityAll }}
                </p>
              </div>
              <div class="flex">
                <label
                  class="block w-[30%] mb-2 text-sm font-semibold tracking-wide text-gray-700"
                  >Total Amount:</label
                >
                <p>
                  {{ purchaseDetails?.totalPurchasePriceAll }}
                </p>
              </div>
              <div class="flex">
                <label
                  class="block w-[30%] mb-2 text-sm font-semibold tracking-wide text-gray-700"
                  >Purchase Tax:</label
                >
                <p>৳{{ purchaseDetails?.totalTaxAll }}</p>
              </div>
              <div class="flex">
                <label
                  class="block w-[30%] mb-2 text-sm font-semibold tracking-wide text-gray-700"
                  >Purchase Discount:</label
                >
                <p>৳{{ purchaseDetails?.totalDiscountAll }}</p>
              </div>
            </div>
            <div>
              <div>
                <div class="flex">
                  <label
                    class="block w-[30%] mb-2 text-sm font-semibold tracking-wide text-gray-700"
                    >Shipping Cost:</label
                  >
                  <p>৳{{ state.shippingCost }}</p>
                </div>
                <!-- <div class="flex">
                  <label
                    class="block w-[30%] mb-2 text-sm font-semibold tracking-wide text-gray-700"
                    >Due:</label
                  >
                  <p>৳0</p>
                </div>
                <div class="flex">
                  <label
                    class="block w-[30%] mb-2 text-sm font-semibold tracking-wide text-gray-700"
                    >Change Amount:</label
                  >
                  <p>৳0</p>
                </div> -->
              </div>
              <div class="flex">
                <label
                  class="block w-[30%] mb-2 text-sm font-semibold tracking-wide text-gray-700"
                  >Grand Total:</label
                >
                <p>৳{{ purchaseDetails?.purchaseSubtotalAll }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServerError :error="serverErrors" />
      <ClientErrors :errors="validator.$errors" />
      <section>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="bg-gray-400 text-white px-2 py-1 rounded-md"
            @click="handleReset"
          >
            Reset
          </button>
          <SpinnerButton type="submit" :loading="loading"> </SpinnerButton>
        </div>
      </section>
    </form>
  </section>
</template>
