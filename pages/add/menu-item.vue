<script setup>
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseSelect from "@/components/common/BaseSelect.vue";
import SpinnerButton from "@/components/common/SpinnerButton.vue";
import SelectBranch from "@/components/branch/SelectBranch.vue";
import SelectCategory from "@/components/category/SelectCategory.vue";
import { ref, reactive, onMounted } from "vue";
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
import { MenuService } from "~/services/MenuService";

definePageMeta({
  layout: "auth-layout",
});
const AVAILABLE = "available";
const UN_AVAILABLE = "unavailable";
const HALF_HOURLY = "half_hourly";
const defaultData = {
  price: "",
  name: "",
  category: "",
  status: AVAILABLE,
};

const serverErrors = ref({});
const state = reactive({ ...defaultData });
const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("Name is required", required) },
    price: { required: helpers.withMessage("Price is required", required) },
    category: { required: helpers.withMessage("Category is required", required) },
    status: { },
  };
});
const validator = useVuelidate(rules, state, { $lazy: true });

const loading = ref(false);

const handleReset = async () => {
  await validator.value.$reset();
  for (let key in state) {
    state[key] = defaultData[key];
  }
  state.status = AVAILABLE
  serverErrors.value = {};
};
const discountData = computed(() => {
  return {
    name: state.name,
    branch_id: state.branch,
    status: state.status,
  };
});
const postItem = async () => {
  try {
    loading.value = true;
    await MenuService.create(discountData.value);
    
    serverErrors.value = {};
    handleReset();
    state.status = AVAILABLE;
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

const handlePlaceChange = () => {};
const options = [
  {
    id  : 'available',
    name  : 'Available',
  },
  {
    id  : 'unavailable',
    name  : 'Un-available',
  },
]
onMounted(() => {
  state.type = "flat";
});
const notice =
  "This checkbox sets the current tariff plan as the default. Note that only one default tariff plan is allowed at a time. If this tariff plan is selected as default, it will override any existing default tariff plan, and the most recently updated default tariff plan will take precedence.";
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <header class="hidden md:flex justify-between text-gray-900 mb-3 text-xl">
      <h6 class="hidden md:inline-block capitalize">{{ "Add Menu" }}</h6>
    </header>
    <form @submit.prevent="onSubmit" ref="formRef" class="grid gap-3">
      <section class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500">
            Name<span class="text-red-500">*</span>
          </label>
          <BaseInput v-model="state.name" placeholder="Menu name" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">
            Name<span class="text-red-500">*</span>
          </label>
          <BaseInput v-model="state.price" type="number" placeholder="e.g. $ 10" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Select Branch</label>
          <SelectBranch v-model="state.branch" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Select category</label>
          <SelectCategory v-model="state.category" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Status</label>
          <BaseSelect :options="options" v-model="state.status" :loading="false" />
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
          <SpinnerButton
            type="submit"
            :loading="loading"
          >
          </SpinnerButton>
        </div>
      </section>
    </form>
  </section>
</template>
