<template>
  <input
    :class="inputClass"
    :value="modelValue"
    @input="handleInput"
    v-bind="$attrs"
    :type="type"
    :placeholder="placeholder"

  />
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    required: false,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "e.g. Name",
  },
  inputClass: {
    type: String,
    default:
      "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 blockholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500",
  },
});

const emit = defineEmits(["update:modelValue"]);

function handleInput(evt) {
  emit("update:modelValue", evt.target.value);
}
function change(evt) {
  emit("update:modelValue", evt.target.value);
}
</script>

<style lang="scss" scoped></style>
