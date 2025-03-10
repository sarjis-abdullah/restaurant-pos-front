<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-lg font-semibold text-gray-800">Confirm Delete</h2>
      <p class="text-gray-600 mt-2">Are you sure you want to delete this record? This action cannot be undone.</p>
      <div class="flex justify-end mt-4">
        <button 
          @click="closeModal" 
          class="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100"
          :disabled="isDeleting"
        >
          Cancel
        </button>
        <button 
          @click="confirmDelete" 
          class="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
          :disabled="isDeleting"
        >
          <span v-if="isDeleting" class="animate-spin mr-2">
            <!-- Replace with your preferred spinner icon or loading indicator -->
            <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </span>
          <span v-else>
            <TrashIcon class="h-5 w-5"/>
          </span>
          <span v-if="isDeleting" class="ml-2">Deleting...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { TrashIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  isOpen: Boolean,
  itemId: Number,
});

const emit = defineEmits(["confirm", "close"]);

const isDeleting = ref(false);

const confirmDelete = async () => {
  isDeleting.value = true;
  emit("confirm", props.itemId);
};

const closeModal = () => {
  emit("close");
};

</script>
