<template>
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-4">Add Branch</h1>
  
      <!-- Success & Error Messages -->
      <p v-if="message" class="text-green-500">{{ message }}</p>
      <p v-if="error" class="text-red-500">{{ error }}</p>
  
      <form @submit.prevent="createBranch" class="space-y-4">
        <div>
          <label class="block font-semibold">Branch Name:</label>
          <input v-model="branch.name" type="text" class="border p-2 w-full" required />
        </div>
  
        <div>
          <label class="block font-semibold">Location:</label>
          <input v-model="branch.location" type="text" class="border p-2 w-full" required />
        </div>
  
        <div>
          <label class="block font-semibold">Type:</label>
          <input v-model="branch.type" type="text" class="border p-2 w-full" required />
        </div>
  
        <div>
          <label class="block font-semibold">Company ID:</label>
          <input v-model="branch.company_id" type="number" class="border p-2 w-full" required />
        </div>
  
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
          Create Branch
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useFetch } from "#app";
  
  // Page meta
  definePageMeta({
    layout: "auth-layout",
  });
  
  // Reactive state
  const branch = ref({
    name: "",
    location: "",
    type: "",
    company_id: null,
  });
  
  const message = ref("");
  const error = ref("");
  
  // Form submission handler
  const createBranch = async () => {
    try {
      // Validate required fields
      if (!branch.value.name || !branch.value.location || !branch.value.type || !branch.value.company_id) {
        error.value = "All fields are required.";
        return;
      }
  
      // Send request using useFetch
      const { data, error: fetchError } = await useFetch("http://localhost:8199/api/v1/branch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: branch.value,
      });
  
      if (fetchError.value) {
        throw fetchError.value;
      }
  
      message.value = "Branch created successfully!";
      error.value = "";
      branch.value = { name: "", location: "", type: "", company_id: null }; // Reset form
    } catch (err) {
      error.value = err?.data?.message || "Failed to create branch.";
      console.error("Error creating branch:", err);
    }
  };
  </script>
  
  <style scoped>
  button:hover {
    opacity: 0.8;
  }
  </style>
  