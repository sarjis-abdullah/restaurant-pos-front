<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-semibold text-gray-800">Confirm Delete</h2>
        <p class="text-gray-600 mt-2">Are you sure you want to delete this record? This action cannot be undone.</p>
        <div class="flex justify-end mt-4">
          <button @click="closeModal" class="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100">Cancel</button>
          <button @click="confirmDelete" class="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center">
            <TrashIcon class="h-5 w-5"/>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from "vue";
  import { TrashIcon } from "@heroicons/vue/20/solid";
  
  const props = defineProps({
    isOpen: Boolean,
    itemId: Number,
  });
  
  const emit = defineEmits(["confirm", "close"]);
  
  const confirmDelete = () => {
    emit("confirm", props.itemId);
  };
  
  const closeModal = () => {
    emit("close");
  };
  </script>
  