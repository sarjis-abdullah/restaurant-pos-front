<template>
    <section class="rounded-lg shadow-lg p-6">
      <header class="hidden md:flex justify-between text-gray-900 mb-3 text-xl">
        <h6 class="hidden md:inline-block capitalize">Add Company</h6>
      </header>
  
      <!-- Company Form -->
      <form @submit.prevent="createCompany" ref="formRef" class="grid gap-3">
        <section class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="grid gap-2">
            <label class="text-gray-500">Company Name<span class="text-red-500">*</span></label>
            <BaseInput v-model="company.name" placeholder="Company name" />
          </div>
        </section>
  
        <ServerError :error="serverErrors" />
        <ClientErrors :errors="validator.$errors" />
  
        <section class="flex justify-end gap-2">
          <button type="button" class="bg-gray-400 text-white px-2 py-1 rounded-md" @click="handleReset">
            Reset
          </button>
          <SpinnerButton type="submit" :loading="loading">Create Company</SpinnerButton>
        </section>
      </form>
    </section>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from "vue";
  import { useVuelidate } from "@vuelidate/core";
  import { required, helpers } from "@vuelidate/validators";
  import SpinnerButton from "@/components/common/SpinnerButton.vue";
  import ClientErrors from "@/components/common/ClientErrors.vue";
  import ServerError from "@/components/common/Error.vue";
  import { useToast } from "vue-toastification";
  import { CompanyService } from "@/services/CompanyService";
  import BaseInput from "@/components/common/BaseInput.vue";
  definePageMeta({ layout: "auth-layout" });
  
  const toast = useToast();
  const serverErrors = ref({});
  const loading = ref(false);
  const companies = ref([]);
  
  const company = reactive({
    name: "",  // Only 'name' field is required
  });
  
  // Form validation rules
  const rules = computed(() => ({
    name: { required: helpers.withMessage("Company Name is required", required) },
  }));
  
  const validator = useVuelidate(rules, company, { $lazy: true });
  
  // Fetch all companies
  const fetchCompanies = async () => {
    try {
      const response = await CompanyService.getAll();
      companies.value = response.data || [];
    } catch (error) {
      toast.error("Failed to fetch companies.");
    }
  };
  
  // Reset form
  const handleReset = async () => {
    await validator.value.$reset();
    company.name = "";
    serverErrors.value = {};
  };
  
  // Create company
  const createCompany = async () => {
    const valid = await validator.value.$validate();
    if (!valid) return;
  
    try {
      loading.value = true;
      // Send data to the server
      await CompanyService.create(company);
      handleReset();
      toast.success("Company created successfully!");
      fetchCompanies(); // Refresh company list
    } catch (error) {
      serverErrors.value = error?.response?.data || { general: "Failed to create company." };
      toast.error("Error creating company. Please try again.");
    } finally {
      loading.value = false;
    }
  };
  
  // Delete company
  const deleteCompany = async (id) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      await CompanyService.delete(id);
      toast.success("Company deleted successfully!");
      fetchCompanies(); // Refresh list
    } catch (error) {
      toast.error("Failed to delete company.");
    }
  };
  
  // Fetch companies on mount
  onMounted(fetchCompanies);
  
  </script>
  