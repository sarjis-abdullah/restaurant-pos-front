<template>
  <section class="rounded-lg  shadow-lg p-6">
    <header class="hidden md:flex justify-between text-gray-900 mb-3 text-xl">
      <h6 class="hidden md:inline-block capitalize">Add Branches</h6>
    </header>

    <!-- Branch Form -->
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

      <section class="flex justify-end gap-2">
        <button type="button" class="bg-gray-400 text-white px-2 py-1 rounded-md" @click="handleReset">
          Reset
        </button>
        <SpinnerButton type="submit" :loading="loading">Create Branch</SpinnerButton>
      </section>
    </form>

    
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import BaseInput from "@/components/common/BaseInput.vue";
import SpinnerButton from "@/components/common/SpinnerButton.vue";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import { useToast } from "vue-toastification";
import { BranchService } from "@/services/BranchService"; // Import BranchService

definePageMeta({ layout: "auth-layout" });

const toast = useToast();
const serverErrors = ref({});
const loading = ref(false);
const branches = ref([]);

const branch = reactive({
  name: "",
  company_id: null,
  type: "",
});

// Form validation rules
const rules = computed(() => ({
  name: { required: helpers.withMessage("Branch Name is required", required) },
  company_id: { required: helpers.withMessage("Company ID is required", required) },
  type: { required: helpers.withMessage("Type is required", required) },
}));

const validator = useVuelidate(rules, branch, { $lazy: true });

// Fetch all branches
const fetchBranches = async () => {
  try {
    const response = await BranchService.getAll();
    branches.value = response.data || [];
  } catch (error) {
    toast.error("Failed to fetch branches.");
  }
};

// Reset form
const handleReset = async () => {
  await validator.value.$reset();
  branch.name = "";
  branch.company_id = null;
  branch.type = "";
  serverErrors.value = {};
};

// Create branch
const createBranch = async () => {
  const valid = await validator.value.$validate();
  if (!valid) return;

  try {
    loading.value = true;
    await BranchService.create(branch);
    handleReset();
    toast.success("Branch created successfully!");
    fetchBranches(); // Refresh list
  } catch (error) {
    serverErrors.value = error?.response?.data || { general: "Failed to create branch." };
    toast.error("Error creating branch. Please try again.");
  } finally {
    loading.value = false;
  }
};

// Delete branch
const deleteBranch = async (id) => {
  if (!confirm("Are you sure you want to delete this branch?")) return;
  try {
    await BranchService.delete(id);
    toast.success("Branch deleted successfully!");
    fetchBranches(); // Refresh list
  } catch (error) {
    toast.error("Failed to delete branch.");
  }
};

// Fetch branches on mount
onMounted(fetchBranches);
</script>
