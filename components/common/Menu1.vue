<template>
  <div>
    <!-- Trigger Button -->
    <button
      @click="toggleMenu"
      ref="menuTrigger"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Open Menu
    </button>

    <!-- Popup Menu -->
    <div
      v-if="isMenuOpen"
      ref="popupMenu"
      class="absolute bg-white shadow-lg border border-gray-300 rounded w-48 z-50"
      :style="positionStyles"
    >
      <ul>
        <li
          v-for="(option, index) in menuOptions"
          :key="index"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          @click="onOptionClick(option)"
        >
          {{ option }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  props: {
    position: {
      type: Object,
      default: () => ({}), // Example: { top: "10px", right: "5px" }
    },
  },
  setup(props) {
    const isMenuOpen = ref(false);
    const menuOptions = ref(["Edit", "Delete", "View Details"]);
    const menuTrigger = ref(null);
    const popupMenu = ref(null);

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const onOptionClick = (option) => {
      alert(`You clicked on: ${option}`);
      isMenuOpen.value = false; // Close menu after selecting an option
    };

    const handleClickOutside = (event) => {
      const menu = popupMenu.value;
      const trigger = menuTrigger.value;
      if (menu && !menu.contains(event.target) && !trigger.contains(event.target)) {
        isMenuOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    const positionStyles = computed(() => ({
      ...props.position,
    }));

    return {
      isMenuOpen,
      menuOptions,
      menuTrigger,
      popupMenu,
      toggleMenu,
      onOptionClick,
      positionStyles,
    };
  },
};
</script>

<style>
/* Add any additional styles if necessary */
</style>
