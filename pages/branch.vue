<template>
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-4">Branch List</h1>
  
      <!-- Loading State -->
      <p v-if="loading" class="text-blue-500">Loading branches...</p>
  
      <!-- Error State -->
      <p v-if="loadingError" class="text-red-500">Failed to load branches.</p>
  
      <!-- Success/Failure Message -->
      <p v-if="message" class="text-green-500">{{ message }}</p>
  
      <!-- Branch List -->
      <table v-if="!loading && branches.length" class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-200">
            <th class="border px-4 py-2">ID</th>
            <th class="border px-4 py-2">Name</th>
            <th class="border px-4 py-2">Status</th> <!-- Displaying Status -->
            <th class="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="branch in branches" :key="branch.id">
            <td class="border px-4 py-2">{{ branch.id }}</td>
            <td class="border px-4 py-2">
              <input v-if="branch.editing" v-model="branch.name" class="border p-1 w-full" />
              <span v-else>{{ branch.name }}</span>
            </td>
            <td class="border px-4 py-2">
              <input v-if="branch.editing" v-model="branch.status" class="border p-1 w-full" /> <!-- Editing Status -->
              <span v-else>{{ branch.status }}</span>
            </td>
            <td class="border px-4 py-2">
              <button 
                @click="editBranch(branch)" 
                class="bg-yellow-500 text-white px-2 py-1 rounded mx-1"
                :disabled="updating"
              >
                {{ branch.editing ? "Save" : "Edit" }}
              </button>
              <button 
                @click="deleteBranch(branch)" 
                class="bg-red-500 text-white px-2 py-1 rounded mx-1"
                :disabled="deleting"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- No Data Message -->
      <p v-else-if="!loading" class="text-red-500">No branches found.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { BranchService } from "@/services/BranchService";
  import { useFetch } from "#app";
  
  // Page meta
  definePageMeta({
    layout: "auth-layout",
  });
  
  // Reactive state
  const branches = ref([]);
  const loading = ref(true);
  const loadingError = ref(false);
  const message = ref("");
  const updating = ref(false);
  const deleting = ref(false);
  
  // Fetch branches when the component is mounted
  onMounted(fetchBranches);
  
  async function fetchBranches() {
    try {
      const response = await BranchService.getAll();
      console.log("Branches:", response);
  
      // Ensure data is an array before setting it
      branches.value = Array.isArray(response.data) ? response.data : [];
  
      // Add editing property for inline editing
      branches.value = branches.value.map((branch) => ({
        ...branch,
        editing: false,
      }));
    } catch (err) {
      loadingError.value = true;
      console.error("Error loading branches:", err);
    }
    loading.value = false;
  }
  
  async function editBranch(branch) {
    if (branch.editing) {
      await updateBranch(branch);
    }
    branch.editing = !branch.editing; // Toggle the editing mode
  }
  
  async function updateBranch(branch) {
    if (updating.value) return; // Prevent multiple update requests
  
    updating.value = true;
    try {
      await BranchService.put(branch.id, {
        name: branch.name,
        status: branch.status, // Include status in the update
      });
  
      // Update the branch locally
      branch.editing = false;
      message.value = "Branch updated successfully!";
    } catch (err) {
      console.error("Error updating branch:", err);
      message.value = "Failed to update branch.";
    } finally {
      updating.value = false;
    }
  }
  
  async function deleteBranch(branch) {
    if (deleting.value) return; // Prevent multiple delete requests
    if (!confirm("Are you sure you want to delete this branch?")) return;
  
    deleting.value = true;
    try {
      await BranchService.delete(branch.id);
  
      // Remove branch from list
      branches.value = branches.value.filter((b) => b.id !== branch.id);
  
      message.value = "Branch deleted successfully!";
    } catch (err) {
      console.error("Error deleting branch:", err);
      message.value = "Failed to delete branch.";
    } finally {
      deleting.value = false;
    }
  }
  </script>
  
  <style scoped>
  button:hover {
    opacity: 0.8;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>
  