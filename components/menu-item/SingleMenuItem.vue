<script setup>
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";
import Menu1 from '@/components/common/Menu1.vue'
defineProps({
  singleData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});
const menuOpen = ref(false);
const isDeleting = ref(false);
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
const record = reactive({
  id: "",
  promoCode: "",
  isActive: false,
});
const formatDateForInput = (date) => {
  if (!date) {
    return "";
  }
  const match = date.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
};
const editRecord = (props) => {
  record.id = props.id;
  record.promoCode = props.promo_code;
  record.isActive = props.is_active ? true : false;
  // record.startDate = formatDateForInput(props.start_date);
  // record.endDate = formatDateForInput(props.end_date);
  list.value = list.value.map((item) => {
    if (item.id == props.id) {
      return {
        ...item,
        editMode: true,
      };
    }
    return {
      ...item,
      editMode: false,
    };
  });
};
const isUpdating = ref(false);
const updateableRecord = computed(() => {
  return {
    promo_code: record.promoCode,
    is_active: record.isActive,
  };
});
const cancelUpdatingRecord = async (id) => {
  list.value = list.value.map((item) => {
    return {
      ...item,
      editMode: false,
    };
  });
};
const updateRecord = async (id) => {
  try {
    isUpdating.value = true;
    const res = await MenuItemService.put(id, updateableRecord.value);
    list.value = list.value.map((item) => {
      if (item.id == id) {
        item.promo_code = record.promoCode;
        item.is_active = record.isActive;
        // item.end_date = record.endDate;
        // item.default = record.default;
        item.editMode = false;
        return item;
      }
      // if (record.default) {
      //   item.default = false;
      // }
      return item;
    });

    serverErrors.value = {};
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isUpdating.value = false;
  }
};
</script>

<template>
  <tr>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <span class="text-gray-900"> {{ singleData?.name }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <span class="text-gray-900"> {{ singleData?.branch_id }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <span class="text-gray-900"> {{ singleData?.status }}</span>
    </td>

    <td
      class="flex justify-center gap-1 whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
    >
      <div class="">
        <Menu1/>
        <button
          class="bg-blue-500 text-white px-2 py-1 rounded"
          @click="menuOpen = !menuOpen"
        >
          Actions
        </button>
        <!-- Dropdown menu -->
        <div
          v-if="menuOpen"
          class="absolute top-full left-0 mt-2 bg-white border border-gray-300 shadow-md rounded w-40 z-50"
        >
          <ul>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
          </ul>
        </div>
      </div>

      <!-- <BasicMenu/> -->
      <TrashIcon
        @click="deleteRecord(singleData.id)"
        class="h-5 w-5"
        aria-hidden="true"
      />
      <!-- <PencilIcon
                      @click="editRecord(singleData)"
                      class="h-5 w-5"
                      aria-hidden="true"
                    /> -->
      <CheckIcon
        v-if="singleData?.editMode"
        @click="updateRecord(singleData.id)"
        class="h-5 w-5 text-blue-500"
        aria-hidden="true"
      />
      <XMarkIcon
        v-if="singleData?.editMode"
        @click="cancelUpdatingRecord(singleData.id)"
        class="h-5 w-5 text-red-500"
        aria-hidden="true"
      />
    </td>
  </tr>
</template>

<style lang="scss" scoped></style>
