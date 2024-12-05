<script setup>
import {
  TrashIcon,
  PencilIcon,
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
import { AddonService } from "~/services/AddonService";
const emit = defineEmits(["update:list", "handle-delete:list"]);
const { singleData } = defineProps({
  singleData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});
const showVariantModal = ref(false);
const showAddonModal = ref(false);
const isDeleting = ref(false);
const serverErrors = ref({});
const deleteRecord = async (id) => {
  if (confirm("Are you sure to delete this record?")) {
    try {
      isDeleting.value = true;
      const res = await AddonService.delete(id);
      emit("handle-delete:list", id)
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
  description: "",
});
const formatDateForInput = (date) => {
  if (!date) {
    return "";
  }
  const match = date.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
};
const editRecord = (props) => {
  editMode.value = !editMode.value;
  record.id = props.id;
  record.name = props.name;
  record.price = props.price;
  record.description = props.description;
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
    const res = await AddonService.put(id, updateableRecord.value);
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
      <template v-if="!editMode">
        <span class="text-gray-900"> {{ singleData?.name }}</span>
        <div>{{ singleData?.description }}</div>
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
        <span v-else class="text-gray-900"> {{ singleData?.price }}</span>
      </section>
    </td>
    
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <section class="flex gap-1 items-center justify-center">
        <div class="">
          <BaseSelect
            placeholder="Select"
            :loading="false"
            :options="[{ name: 'Show variants', id: 'variants' }, { name: 'Show addons', id: 'addons' }]"
            @change="handleOptionChange"
            v-model="selectedAction"
          />
        </div>
        <TrashIcon
          @click="deleteRecord(singleData.id)"
          class="h-5 w-5"
          aria-hidden="true"
        />
        <PencilIcon
          v-if="!editMode"
          @click="editRecord(singleData)"
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
    title="Add variant"
  >
    <section>
      <MenuItemVariantList :menuItemId="singleData.id" />
    </section>
  </Modal>
  <Modal
    :open="showAddonModal"
    @close="closeModal"
    maxWidth="max-w-2xl"
    title="Add addons"
  >
    <section>
      <MenuItemAddonList :menuItemId="singleData.id" />
    </section>
  </Modal>
</template>

<style lang="scss" scoped></style>
