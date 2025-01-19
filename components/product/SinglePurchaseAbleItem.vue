<script setup>
import {
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";
import PopupMenu from "@/components/common/Menu1.vue";
import BaseSelect from "@/components/common/BaseSelect.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import Modal from "@/components/common/Modal.vue";
import ServerError from "@/components/common/Error.vue";
import Loader from "@/components/common/Loading.vue";
import MenuItemVariantList from "@/components/menu-item/variant/AddVariantList.vue";
import MenuItemAddonList from "@/components/menu-item/addon/AddAddonList.vue";
import SelectPurchaseSku from "@/components/purchase/SelectPurchaseSku.vue";
import { PurchaseProductService } from "~/services/PurchaseProductService";
import { usePayments } from "~/hooks/usePayments";
import { usePurchaseAbleProduct } from "~/hooks/usePurchaseAbleProduct";
import { usePurchaseStore } from "~/stores/purchase";

const emit = defineEmits(["update:list"]);

const { singleData } = defineProps({
  singleData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const { totalPaid } = usePayments(singleData?.payments);
const showVariantModal = ref(false);
const showAddonModal = ref(false);
const isDeleting = ref(false);
const serverErrors = ref({});
const purchaseStore = usePurchaseStore();

const removeCartItem = async (id) => {
  purchaseStore.removeCartItem(id);
};
const editMode = ref(false);
const record = reactive({
  quantity: 0,
  purchasePrice: 0,
  sellingPrice: 0,
  sku: "",
  stockId: null,
  exipreDate: null,
  tax: 0,
  discount: 0,
  allocatedShippingCost: 0,
  discountType: "percentage",
  taxType: "percentage",
});
const selectedSku = ref("");
const handleSkuChange = (value) => {
  console.log(value);
  if (value == "customSku") {
    record.sku = "";
  } else if (value == "autoSku") {
    record.sku = value;
  } else {
    record.sku = "";
    record.stockId = value;
  }
  // record.stockId = value;
  // updateField("stockId", value);
};

const {
  purchasePrice,
  totalPurchasePrice,
  discountPerUnit,
  totalDiscount,
  taxPerUnit,
  totalTax,
  costPerUnit,
  purchaseSubtotal,
  profitPerItem,
  totalProfit,
  profitPercentage,
  taxType,
  discountType,
  shippingCostPerUnit,
} = usePurchaseAbleProduct(record);
const purchseData = computed(() => {
  return {
    product_id: singleData.id,
    quantity: record.quantity,
    purchase_price: record.purchasePrice,
    selling_price: record.sellingPrice,
    sku: record.sku,
    stock_id: record.stockId,
    tax: record.tax,
    discount: record.discount,
    cost_per_unit: costPerUnit.value,
    allocated_shipping_cost: record.allocatedShippingCost,
    discount_type: record.discountType,
    tax_type: record.taxType,
  };
});
const updateField = (key, value) => {
  console.log(singleData.index, key, value);
  // 'update', this.index, key, value
  purchaseStore.updateItem(singleData.index, key, value);
};
const toggleDiscountType = (type = "") => {
  record.discountType = type;
  updateField("discountType", type);
};

const selectedAction = ref("");
const closeModal = (id) => {
  showVariantModal.value = false;
  showAddonModal.value = false;
  selectedAction.value = "";
};
watch(
  () => singleData,
  (newValue, oldValue) => {
    if (newValue != oldValue) {
      record.allocatedShippingCost = singleData?.allocatedShippingCost;
      purchaseStore.setAllocatedShippingCost(record.allocatedShippingCost);
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <tr>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <span class="text-gray-900">
        {{ singleData?.index + 1 }}
      </span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <template v-if="!editMode">
        <span class="text-gray-900 max-w-[5rem]">{{
          singleData?.barcode
        }}</span>
      </template>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <section class="flex gap-1 items-center">
        <p class="text-gray-900 max-w-[5rem]" style="white-space: break-spaces">
          {{ singleData?.name }}
        </p>
      </section>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <template v-if="selectedSku == 'customSku'">
        <BaseInput
          v-model="record.sku"
          placeholder="e.g. Sku"
          class="min-w-[5rem]"
          @input="updateField('sku', record.sku)"
        />
      </template>
      <span>
        <SelectPurchaseSku
          v-model="selectedSku"
          @change="handleSkuChange"
          :stocks="singleData.stocks"
          class="min-w-[5rem]"
        />
      </span>
      <!-- <span v-else class="text-gray-900"> {{ "sku" }}</span> -->
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <div v-if="true" class="flex items-center gap-1">
        <div>
          <BaseInput
            v-model="record.quantity"
            type="number"
            placeholder="0"
            @input="updateField('quantity', record.quantity)"
          />
        </div>
        <div>/{{ singleData.unit }}</div>
      </div>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <template v-if="true">
        <BaseInput
          v-model="record.purchasePrice"
          type="number"
          placeholder="$10.00"
          @input="updateField('purchasePrice', record.purchasePrice)"
        />
      </template>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <span class="text-gray-900"> {{ totalPurchasePrice }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <!-- tax -->
      <BaseInput
        v-model="record.tax"
        type="number"
        placeholder="0"
        @input="updateField('tax', record.tax)"
      />
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <!-- Discount -->

      <div class="flex gap-1 flex-col justify-between items-center">
        <div>
          <BaseInput
            v-model="record.discount"
            type="number"
            placeholder="0"
            @input="updateField('discount', record.discount)"
          />
        </div>
        <div class="border-2 border-[#0EB679] rounded">
          <button
            @click="toggleDiscountType('flat')"
            type="button"
            :class="
              record.discountType == 'flat' ? 'bg-[#0EB679] text-white' : ''
            "
            class="h-6 px-2"
          >
            .0
          </button>
          <button
            @click="toggleDiscountType('percentage')"
            type="button"
            :class="
              record.discountType == 'percentage'
                ? 'bg-[#0EB679] text-white'
                : ''
            "
            class="h-6 px-2"
          >
            %
          </button>
        </div>
      </div>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <BaseInput
        v-model="record.exipreDate"
        type="date"
        placeholder="e.g. Color"
        class="max-w-[8rem]"
        @change="updateField('exipreDate', record.exipreDate)"
      />
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <span>
        {{ singleData?.allocatedShippingCost }}
      </span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <span>
        {{ Number(costPerUnit).toFixed(2) }}
      </span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <template v-if="true">
        <BaseInput
          v-model="record.sellingPrice"
          type="number"
          placeholder="$10.00"
          @input="updateField('sellingPrice', record.sellingPrice)"
        />
      </template>
    </td>

    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <span class="text-gray-900">
        {{ Number(purchaseSubtotal).toFixed(2) }}</span
      >
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <span class="text-gray-900"> {{ profitPercentage }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm border-r">
      <section class="flex gap-1 items-center justify-center">
        <!-- <TrashIcon
          @click="deleteRecord(singleData.id)"
          class="h-5 w-5"
          aria-hidden="true"
        />
        <EyeIcon
          @click="viewRecord(singleData)"
          class="h-5 w-5"
          aria-hidden="true"
        />
        <CheckIcon
          v-if="editMode"
          @click="updateRecord(singleData.id)"
          class="h-5 w-5 text-blue-500"
          aria-hidden="true"
        /> -->
        <XMarkIcon
          @click="removeCartItem(singleData.id)"
          class="h-5 w-5 text-red-500"
          aria-hidden="true"
        />
        <!-- <Loader parentClass="" v-if="editMode && (isDeleting || isUpdating)" /> -->
      </section>
    </td>
  </tr>
  <tr v-if="serverErrors && Object.keys(serverErrors).length">
    <ServerError :error="serverErrors" />
  </tr>
  <Modal
    :open="showVariantModal"
    @close="closeModal"
    maxWidth="max-w-2xl"
    title="Add menu-item variants"
  >
    <section>
      <MenuItemVariantList :menuItemId="singleData.id" />
    </section>
  </Modal>
  <Modal
    :open="showAddonModal"
    @close="closeModal"
    maxWidth="max-w-2xl"
    title="Add menu-item addons"
  >
    <section>
      <MenuItemAddonList :menuItemId="singleData.id" />
    </section>
  </Modal>
</template>

<style lang="scss" scoped></style>
