<script setup>
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon
} from "@heroicons/vue/20/solid";
import PopupMenu from "@/components/common/Menu1.vue";
import BaseSelect from "@/components/common/BaseSelect.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import Modal from "@/components/common/Modal.vue";
import ServerError from "@/components/common/Error.vue";
import Loader from "@/components/common/Loading.vue";
import MenuItemVariantList from "@/components/menu-item/variant/AddVariantList.vue";
import MenuItemAddonList from "@/components/menu-item/addon/AddAddonList.vue";
import { PurchaseProductService } from "~/services/PurchaseProductService";
import { usePayments } from "~/hooks/usePayments";
const emit = defineEmits(["update:list"]);
 
const { singleData } = defineProps({
  singleData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});
const {totalPaid} = usePayments(singleData?.payments)
const showVariantModal = ref(false);
const showAddonModal = ref(false);
const isDeleting = ref(false);
const serverErrors = ref({});
const deleteRecord = async (id) => {
  if (confirm("Are you sure to delete this record?")) {
    try {
      isDeleting.value = true;
      const res = await PurchaseProductService.delete(id);
      list.value = list.value.filter((item) => item.id != id);

      serverErrors.value = {};
      // handleReset();
    } catch (error) {
      serverErrors.value = error.errors;
    } finally {
      isDeleting.value = false;
    }
  }
};
const editMode = ref(false);
const record = reactive({
  id: "",
  name: "",
  price: "",
  type: "",
  description: "",
});
const formatDateForInput = (date) => {
  if (!date) {
    return "";
  }
  const match = date.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
};
const router = useRouter()
const viewRecord = (props) => {
  const url = "/purchase-details/" + props.purchase_id
  window.open(url, '_blank').focus();
};
const isUpdating = ref(false);
const updateableRecord = computed(() => {
  const data = { ...record };
  delete data.id;
  return data;
});
const cancelUpdatingRecord = () => {
  editMode.value = false;
  for (let key in record) {
    record[key] = "";
  }
};
const updateRecord = async (id) => {
  try {
    isUpdating.value = true;
    console.log(id, updateableRecord.value);
    const res = await PurchaseProductService.put(id, updateableRecord.value);
    emit("update:list", res.data);
    editMode.value = false;
    serverErrors.value = {};
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isUpdating.value = false;
  }
};
const selectedAction = ref("");
const handleOptionChange = (id) => {
  selectedAction.value = id;
  if (id == "variants") {
    showVariantModal.value = !showVariantModal.value;
  }else if (id == "addons") {
    showAddonModal.value = !showAddonModal.value;
  }
  console.log(id, singleData);
};
const closeModal = (id) => {
  showVariantModal.value = false;
  showAddonModal.value = false;
  selectedAction.value = "";
};
</script>

<template>
  <tr>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <span class="text-gray-900"> {{ singleData?.index }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <template v-if="!editMode">
        <span class="text-gray-900"> {{ singleData?.purchase?.purchase_date }}</span>
      </template>
      <div v-else class="flex flex-col gap-2">
        <BaseInput v-model="record.name" placeholder="e.g. Name" />
        <BaseInput
          v-model="record.description"
          placeholder="e.g. Description"
        />
      </div>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <section class="flex gap-1 items-center">
        <template v-if="editMode">
          <BaseInput v-model="record.price" placeholder="e.g. 10" type="number" />
        </template>
        <span v-else class="text-gray-900"> {{ singleData?.purchase?.supplier?.name }}</span>
      </section>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <template v-if="editMode">
        <BaseInput v-model="record.type" placeholder="e.g. Color" />
      </template>
      <span v-else class="text-gray-900"> {{ singleData?.quantity }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <template v-if="editMode">
        <BaseInput v-model="record.type" placeholder="e.g. Color" />
      </template>
      <span v-else class="text-gray-900"> {{ singleData?.purchase_price }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <template v-if="editMode">
        <BaseInput v-model="record.type" placeholder="e.g. Color" />
      </template>
      <span v-else class="text-gray-900"> {{ singleData?.selling_price }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <template v-if="editMode">
        <BaseInput v-model="record.type" placeholder="e.g. Color" />
      </template>
      <span v-else class="text-gray-900"> {{ singleData?.subtotal }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <template v-if="editMode">
        <BaseInput v-model="record.type" placeholder="e.g. Color" />
      </template>
      <span v-else class="text-gray-900"> {{ singleData?.tax }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <template v-if="editMode">
        <BaseInput v-model="record.type" placeholder="e.g. Color" />
      </template>
      <span v-else class="text-gray-900"> {{ singleData?.discount }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <section class="flex gap-1 items-center justify-center">
        <TrashIcon
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
        />
        <XMarkIcon
          v-if="editMode"
          @click="cancelUpdatingRecord"
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
