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
import { MenuItemService } from "~/services/MenuItemService";
const emit = defineEmits(["update:list"]);
const { singleData } = defineProps({
  singleData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});
const showEditModal = ref(false);
const isDeleting = ref(false);
const serverErrors = ref({});
const deleteRecord = async (id) => {
  if (confirm("Are you sure to delete this record?")) {
    try {
      isDeleting.value = true;
      const res = await MenuItemService.delete(id);
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
const editRecord = (props) => {
  editMode.value = !editMode.value;
  record.id = props.id;
  record.name = props.name;
  record.price = props.price;
  record.type = props.type;
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
    const res = await MenuItemService.put(id, updateableRecord.value);
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
    showEditModal.value = !showEditModal.value;
  }
  console.log(id, singleData);
};
const closeModal = (id) => {
  showEditModal.value = false;
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
      <template v-else>
        <BaseInput v-model="record.name" placeholder="e.g. Name" />
        <BaseInput
          v-model="record.description"
          placeholder="e.g. Description"
        />
      </template>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <template v-if="editMode">
        <BaseInput v-model="record.price" placeholder="e.g. 10" />
      </template>
      <span v-else class="text-gray-900"> {{ singleData?.price }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <template v-if="editMode">
        <BaseInput v-model="record.type" placeholder="e.g. Color" />
      </template>
      <span v-else class="text-gray-900"> {{ singleData?.type }}</span>
    </td>

    <td
      class="flex justify-center items-center gap-1 whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
    >
      <div class="">
        <BaseSelect
          placeholder="Select"
          :loading="false"
          :options="[{ name: 'Show variants', id: 'variants' }]"
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
      <Loader parentClass="" v-if="editMode && (isDeleting || isUpdating)" />
    </td>
  </tr>
  <tr v-if="serverErrors && Object.keys(serverErrors).length">
    <ServerError :error="serverErrors" />
  </tr>
  <Modal
    :open="showEditModal"
    @close="closeModal"
    maxWidth="max-w-2xl"
    title="Add variant"
  >
    <section>
      <MenuItemVariantList :menuItemId="singleData.id" />
    </section>
  </Modal>
</template>

<style lang="scss" scoped></style>
