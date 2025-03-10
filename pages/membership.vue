
<script setup>
import { onMounted } from "vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import { MembershipService } from "~/services/MembershipService.js";
import { useDebounce } from "@/hooks/useDebounce";
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";
import Loading from "@/components/common/Loading.vue";
import ServerError from "@/components/common/Error.vue";
import { MembershipTypeService } from "~/services/MembershipTypeService";
import Titlebar from "@/components/common/Titlebar.vue";

definePageMeta({
  layout: "auth-layout",
});
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
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
  return `?page=${page.value}&per_page=${perPage.value}&include=m.mt,m.vehicle`;
});
const searchQuery2 = computed(() => {
  return `?page=1&per_page=50`;
});
const membershipTypes = ref([]);
const loadMembershipTypeData = async () => {
  try {
    isLoading.value = true;
    const { meta, data } = await MembershipTypeService.getAll(
      searchQuery2.value
    );
    console.log(12345);
    membershipTypes.value = data;

    // page.value = meta.current_page;
    // lastPage.value = meta.last_page;
    // total.value = meta.total;
    // totalPerPage.value = data.length;

    serverErrors.value = {};
    // handleReset();
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isLoading.value = false;
  }
};
const loadData = async (query = searchQuery.value) => {
  try {
    isLoading.value = true;
    const { meta, data } = await MembershipService.getAll(query);
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
const isDeleting = ref(false);
const deleteRecord = async (id) => {
  if (confirm("Are you sure to delete this record?")) {
    try {
      isDeleting.value = true;
      const res = await MembershipService.delete(id);
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
  name: "",
  membership_type_id: null,
  active: 0,
});
const editRecord = (props) => {
  record.id = props.id;
  record.name = props.name;
  record.active = props.active ? true : false;
  record.membership_type_id = props.membership_type_id;
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
    name: record.name,
    membership_type_id: record.membership_type_id,
    active: record.active ? 1: 0,
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
    const res = await MembershipService.put(
      id + "?include=m.mt",
      updateableRecord.value
    );
    if (res?.data) {
      list.value = list.value.map((item) => {
        if (item.id == id) {
          item.name = record.name;
          item.membership_type_id = res.data.membership_type_id;
          item.membership_type = res.data.membership_type;
          item.editMode = false;
          item.active = record.active;
          return item;
        }
        return item;
      });
    }

    serverErrors.value = {};
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isUpdating.value = false;
  }
};

//search
const searchText = ref("");
const search = async () => {
  const q = searchText.value
    ? searchQuery.value + `&query=${searchText.value}`
    : searchQuery.value;
  loadData(q);
};
const debouncedSearch = useDebounce(search, 500);

const onPageChanged = (p) => {
  page.value = p;
  loadData(searchQuery.value);
};
onMounted(() => {
  loadData(searchQuery.value);
  loadMembershipTypeData();
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
          <header class="flex justify-between text-gray-900 mb-3 text-xl">
            <h6 class="hidden md:inline-block">{{ "Membership List" }}</h6>
            <div v-if="list && list?.length > 0" class="flex items-center gap-2">
              <input
                :class="inputClass"
                v-model="searchText"
                @input="debouncedSearch"
                type="text"
                placeholder="e.g. Search here"
              />
              <XMarkIcon
                v-if="searchText"
                @click="()=> {
                  searchText=''
                  loadData()
                }"
                class="h-5 w-5 text-red-500 cursor-pointer"
                aria-hidden="true"
              />
            </div>
          </header>
          <!-- <pre>
          {{ list }}
        </pre> -->
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
                    Number
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
                    Membership type
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Vehicle No.
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Total parked in count.
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="singleData in list" :key="singleData.id">
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div class="">
                        <div class="font-medium text-gray-900">
                          {{ singleData.contact_number }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <div v-if="singleData.editMode" class="mt-1 text-gray-500">
                      <input
                        :class="inputClass"
                        v-model="record.name"
                        type="text"
                        placeholder="e.g. Member name"
                      />
                    </div>
                    <span v-else class="text-gray-900">{{
                      singleData.name ?? "--"
                    }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <div v-if="singleData.editMode" class="mt-1 text-gray-500">
                      <select
                        class="focus:outline-none bg-none"
                        :class="inputClass"
                        style="background: none"
                        name="place"
                        v-model="record.membership_type_id"
                      >
                        <option
                          v-for="item in membershipTypes"
                          :key="item.id"
                          :value="item.id"
                        >
                          {{ item.name }}
                        </option>
                      </select>
                    </div>
                    <span v-else class="text-gray-900">{{
                      singleData?.membership_type?.name
                    }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <span class="text-gray-900">{{
                      singleData?.vehicle?.number
                    }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <span class="text-center bg-indigo-500 text-white p-2 rounded">{{
                      singleData?.totalParkingCount
                    }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <div
                      v-if="singleData.editMode"
                      class="flex items-center gap-1 mt-1 text-gray-500"
                    >
                      <input
                        v-model="record.active"
                        type="checkbox"
                        value=""
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label class="text-gray-500">Marked as active</label>
                      <!-- <input
                        :class="inputClass"
                        v-model="record.discount"
                        type="text"
                        placeholder="e.g. Text about place"
                      /> -->
                    </div>
                    <span v-else class="text-gray-900">{{
                      singleData.active ? "Active" : "Inactive"
                    }}</span>
                  </td>
                  <td
                    class="flex justify-center gap-1 relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
                    <TrashIcon
                      @click="deleteRecord(singleData.id)"
                      class="h-5 w-5"
                      aria-hidden="true"
                    />
                    <PencilIcon
                      @click="editRecord(singleData)"
                      class="h-5 w-5"
                      aria-hidden="true"
                    />
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
              </tbody>
            </table>
            <div v-else class="text-center py-10">
              <p class="text-xl text-gray-400">
                No data available
              </p>
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
    <Loading v-if="isLoading || isDeleting || isUpdating" />
    <Pagination
      class="mt-6"
      :perPage="perPage"
      :lastPage="lastPage"
      :total="total"
      :totalPerPage="totalPerPage"
      @onChange="onPageChanged"
    />
  </div>
</template>