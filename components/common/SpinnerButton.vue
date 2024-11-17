<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    :class="[
      'px-4 py-2 rounded flex items-center justify-center transition-colors',
      bgClass,
      extraClass,
      loading ? 'cursor-not-allowed opacity-70' : 'hover:bg-opacity-90',
    ]"
    @click="onClick"
  >
    <template v-if="loading">
      <svg
        class="animate-spin h-5 w-5 mr-2 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <span>{{ loadingText }}</span>
    </template>
    <template v-else>
      <span>{{ defaultText }}</span>
    </template>
  </button>
</template>
<script setup>
defineProps({
  type: {
    type: String,
    default: "button",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultText: {
    type: String,
    default: "Submit",
  },
  loadingText: {
    type: String,
    default: "Loading...",
  },
  bgClass: {
    type: String,
    default: "bg-brand-400 text-white hover:bg-brand-500",
  },
  extraClass: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["click"]);

function handleInput(evt) {
  if (!props.disabled && !props.loading) {
    emit("click", evt.target.value);
  }
}
</script>

<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
