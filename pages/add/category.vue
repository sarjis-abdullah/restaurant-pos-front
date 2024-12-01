<script setup>
import AuthLayout from "../layouts/AuthLayout.vue";
import ErrorMessage from "../components/common/ErrorMessage.vue";
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";
import { CategoryService } from "@/services/CategoryService.js";
import { PlaceService } from "@/services/PlaceService.js";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import { useCategoryStore } from '~/stores/category';
import BaseInput from "@/components/common/BaseInput.vue";
import SpinnerButton from "~/components/common/SpinnerButton.vue";
import SelectBranch from "~/components/branch/SelectBranch.vue";
import { useBranchStore } from '~/stores/branch';

definePageMeta({
  layout: "auth-layout",
});
const categoryStore = useCategoryStore();
const defaultData = {
  name: "",
  description: "",
};
const serverErrors = ref({});
const state = reactive(defaultData);
const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("Name is required", required) },
    // branch: { required: helpers.withMessage("Branch is required", required) },
    description: {},
  };
});
const branchStore = useBranchStore();
const selectedBranch = computed(()=> branchStore.selectedBranch);
const state2 = reactive({...defaultData, branch: selectedBranch.value});

const validator = useVuelidate(rules, state, { $lazy: true });

const loading = ref(false);

const handleReset = async () => {
  await validator.value.$reset();
  for (let key in state) {
    state[key] = "";
  }
  // formRef.value?.reset();
  console.log("handleReset");
};
const postItem = async () => {
  try {
    loading.value = true;
    await CategoryService.create(state);
    serverErrors.value = {};
    handleReset();
  } catch (error) {
    serverErrors.value = error;
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
const places = ref([]);
const getPlaces = async () => {
  const { data } = await PlaceService.getAll("");
  places.value = data;
};
const categoryList = computed(()=> categoryStore?.categoryList?.length ? categoryStore.categoryList : [])
const categoryListLoading = ref(false)
onMounted(async() => {
  // getPlaces();
  // categoryListLoading.value = true
  // await categoryStore.fetchCategories()
  // categoryListLoading.value = false
});

const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="max-w-2xl rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <header class="hidden md:flex justify-between text-gray-900 mb-3 text-xl">
      <h6 class="hidden md:inline-block capitalize">{{ 'Add Category' }}</h6>
    </header>
    <form @submit.prevent="onSubmit" ref="formRef" class="grid gap-3">
      <section class="grid grid-cols-1 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500">
            Name<span class="text-red-500">*</span>
          </label>
          <input
            :class="inputClass"
            v-model="state.name"
            type="text"
            placeholder="e.g. Car/Micro/Motor-cycle"
          />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">
            Name<span class="text-red-500">*</span>
          </label>
          <input
            :class="inputClass"
            v-model="state.name"
            type="text"
            placeholder="e.g. Car/Micro/Motor-cycle"
          />
        </div>

        <!-- <div class="grid gap-2">
          <label class="text-gray-500">Select Branch</label>
          <SelectBranch />
        </div> -->
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
