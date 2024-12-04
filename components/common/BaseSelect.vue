<template>
  <span :class="customClass" v-if="loading">Loading...</span>

  <select
    v-else
    :name="name"
    :class="['focus:outline-none bg-none', customClass]"
    :style="{ background: backgroundStyle }"
    :value="modelValue"
    @change="onChange"
  >
    <option v-if="placeholder" :disabled="true" :value="optionDefaultValue">
      {{ placeholder }}
    </option>
    <option
      v-for="option in options"
      :key="option.id"
      :value="option.id"
    >
      {{ option.name }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  optionDefaultValue: {
    type: [String, Number, null],
    default: '',
  },
  modelValue: {
    type: [String, Number, null],
    default: null,
  },
  name: {
    type: String,
    default: "",
  },
  
  placeholder: {
    type: String,
    default: "Select an option",
  },
  customClass: {
    type: String,
    default: "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500",
  },
  backgroundStyle: {
    type: String,
    default: "none",
  },
  loading: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Array,
    required: true,
    default: () => [],
    // Example: [{ value: 1, label: "Option 1" }, { value: 2, label: "Option 2" }]
  },
});

const emit = defineEmits(["update:modelValue", "change"]);
const onChange = (event) => {
  emit("update:modelValue", event.target.value);
  emit("change", event.target.value);
};
</script>
