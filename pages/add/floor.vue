<script setup>
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";
import { BranchService } from "@/services/BranchService.js";
import { FloorService } from "@/services/FloorService.js";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import SpinnerButton from "~/components/common/SpinnerButton.vue";

definePageMeta({
  layout: "auth-layout",
});
const defaultData = {
  name: "",
  branch: "",
};
const serverErrors = ref({});
const state = reactive(defaultData);
const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("Name is required", required) },
    branch: { required: helpers.withMessage("Branch is required", required) },
  };
});
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
    const obj = { ...state, branch_id: state.branch };
    delete obj.branch;
    await FloorService.create(obj);
    serverErrors.value = {};
    handleReset();
  } catch (error) {
    if (error.response?._data?.errors) {
      serverErrors.value = error.response._data.errors;
    } else if (error.response?.data?.errors) {
      serverErrors.value = error.response?.data.errors;
    }
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
const branches = ref([]);
const getBranches = async () => {
  const { data } = await BranchService.getAll("");
  branches.value = data;
};
onMounted(() => {
  getBranches();
});

const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="max-w-2xl rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <header class="hidden md:flex justify-between text-gray-900 mb-3 text-xl">
      <h6 class="hidden md:inline-block capitalize">{{ 'Add Floor' }}</h6>
    </header>
    <form @submit.prevent="onSubmit" ref="formRef" class="grid gap-3">
      <section class="grid grid-cols-1 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500">
            Name<span class="text-red-500">*</span>
          </label>
          <BaseInput
            v-model="state.name"
            type="text"
            placeholder="e.g. Ground/Basement floor"
          />
          <!-- <ServerErrorMessage :errors="validator.name.$errors" /> -->
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">
            Branch<span class="text-red-500">*</span>
          </label>
          <select
            class="focus:outline-none bg-none"
            :class="inputClass"
            style="background: none"
            name="branch"
            v-model="state.branch"
            :key="state.branch"
          >
            <option disabled :value="''">Select branch name</option>
            <option v-for="branch in branches" :key="branch.id" :value="branch.id">
              {{ branch.name }}
            </option>
          </select>
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
