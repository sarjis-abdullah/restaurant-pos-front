<template>
  <section class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <header class="hidden md:flex justify-between text-gray-900 mb-3 text-xl">
      <h6 class="hidden md:inline-block capitalize">Add Branch</h6>
    </header>

    <form @submit.prevent="createBranch" ref="formRef" class="grid gap-3">
      <section class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500">Branch Name<span class="text-red-500">*</span></label>
          <BaseInput v-model="branch.name" placeholder="Branch name" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Company ID<span class="text-red-500">*</span></label>
          <BaseInput v-model="branch.company_id" type="number" placeholder="Company ID" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Type<span class="text-red-500">*</span></label>
          <BaseInput v-model="branch.type" placeholder="Branch Type" />
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
          <SpinnerButton type="submit" :loading="loading"></SpinnerButton>
        </div>
      </section>
    </form>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import BaseInput from "@/components/common/BaseInput.vue";
import SpinnerButton from "@/components/common/SpinnerButton.vue";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import { useFetch } from "#app";
import { useToast } from "vue-toastification"; // Import Toast

// Page meta
definePageMeta({
  layout: "auth-layout",
});

const toast = useToast(); // Initialize toast
const serverErrors = ref({});
const loading = ref(false);

const branch = reactive({
  name: "",
  company_id: null,
  type: "",
});

const rules = computed(() => ({
  name: { required: helpers.withMessage("Branch Name is required", required) },
  company_id: { required: helpers.withMessage("Company ID is required", required) },
  type: { required: helpers.withMessage("Type is required", required) },
}));

const validator = useVuelidate(rules, branch, { $lazy: true });

const handleReset = async () => {
  await validator.value.$reset();
  branch.name = "";
  branch.company_id = null;
  branch.type = "";
  serverErrors.value = {};
};

const createBranch = async () => {
  const valid = await validator.value.$validate();
  if (!valid) return;

  try {
    loading.value = true;
    const { data, error: fetchError } = await useFetch("http://localhost:8199/api/v1/branch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 31|FU6SufLuOdPfphDe8jF2MLvFKp6RRLF77t5tkPeo876a90e2",
      },
      body: branch,
    });

    if (fetchError.value) throw fetchError.value;

    handleReset();
    toast.success("Branch created successfully!"); // Success toast
  } catch (error) {
    serverErrors.value = error.errors || { general: "Failed to create branch." };
    toast.error("Error creating branch. Please try again."); // Error toast
  } finally {
    loading.value = false;
  }
};
</script>
