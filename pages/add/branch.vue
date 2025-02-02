<script setup>
import { ref, reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { BranchService } from "@/services/BranchService.js";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import SpinnerButton from "~/components/common/SpinnerButton.vue";

definePageMeta({
  layout: "auth-layout",
});

const defaultData = {
  name: "",
  location: "",
  manager: "",
};
const serverErrors = ref({});
const state = reactive(defaultData);
const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("Branch name is required", required) },
    location: { required: helpers.withMessage("Location is required", required) },
    manager: { required: helpers.withMessage("Manager name is required", required) },
  };
});
const validator = useVuelidate(rules, state, { $lazy: true });
const loading = ref(false);

const handleReset = async () => {
  await validator.value.$reset();
  Object.keys(state).forEach(key => state[key] = "");
};

const postBranch = async () => {
  try {
    loading.value = true;
    await BranchService.create(state);
    serverErrors.value = {};
    handleReset();
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    loading.value = false;
  }
};

const onSubmit = async () => {
  if (await validator.value.$validate()) {
    postBranch();
  } else {
    console.log("Please fill out the form correctly!");
  }
};
</script>

<template>
  <section class="max-w-2xl rounded-lg bg-gray-100 shadow-lg p-6">
    <header class="hidden md:flex justify-between text-gray-900 mb-3 text-xl">
      <h6 class="hidden md:inline-block capitalize">Add Branch</h6>
    </header>
    <form @submit.prevent="onSubmit" class="grid gap-3">
      <section class="grid grid-cols-1 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500">Branch Name<span class="text-red-500">*</span></label>
          <BaseInput v-model="state.name" placeholder="e.g. Downtown Branch" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Location<span class="text-red-500">*</span></label>
          <BaseInput v-model="state.location" placeholder="e.g. 123 Main St" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Manager<span class="text-red-500">*</span></label>
          <BaseInput v-model="state.manager" placeholder="e.g. John Doe" />
        </div>
      </section>
      <ServerError :error="serverErrors" />
      <ClientErrors :errors="validator.$errors" />
      <section>
        <div class="flex justify-end gap-2">
          <button type="button" class="bg-gray-400 text-white px-2 py-1 rounded-md" @click="handleReset">
            Reset
          </button>
          <SpinnerButton type="submit" :loading="loading" />
        </div>
      </section>
    </form>
  </section>
</template>
