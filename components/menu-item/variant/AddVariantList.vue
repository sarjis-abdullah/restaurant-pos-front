<template>
  <form @submit.prevent="validateAll" class="grid gap-2 rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <SingleVariant v-for="item in variants" :key="item.id" :variant="item" />
    <header class="flex justify-between text-gray-900 mb-3 text-xl">
      <button
        @click="addNewVariant"
        type="button"
        class="bg-brand-400 text-white px-4 py-2 rounded hover:bg-brand-500"
      >
        <PlusIcon class="h-5 w-5" />
      </button>
      <SpinnerButton
        v-if="variants.length"
        :loading="loading"
        type="submit"
      >
      </SpinnerButton>
    </header>
    <ClientErrors :errors="validator.$errors" />
    <ServerError :error="serverErrors" />
  </form>
  <VariantList :menuItemId="menuItemId" :key="newVariantsAddedKey" />
</template>

<script setup>
import SingleVariant from "./SingleVariant.vue";
import VariantList from "./List.vue";
import { PlusIcon, FolderIcon } from "@heroicons/vue/20/solid";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import SpinnerButton from "@/components/common/SpinnerButton.vue";
import { VariantService } from "~/services/VariantService";

const { menuItemId } = defineProps({
  menuItemId: {
    type: Number,
    required: true,
    default: null,
  },
});
const defaultVariant = {
  id: 1,
  name: "",
  price: "",
  type: "",
};
const variants = ref([]);

const rules = computed(() => {
  return variants.value.map(() => ({
    name: {
      required: helpers.withMessage("Name is required", required),
    },
    price: {
      required: helpers.withMessage("Price is required", required),
    },
    type: {
      required: helpers.withMessage("Type is required", required),
    },
  }));
});

// Using Vuelidate
const validator = useVuelidate(() => rules.value, variants);
const addNewVariant = () => {
  variants.value.push({
    id: variants.value.length + 1,
    name: "",
    price: "",
    type: "",
  });
};
const handleReset = async () => {
  await validator.value.$reset();
  variants.value = [];
  variants.value.push({
    id: 1,
    name: "",
    price: "",
    type: "",
  });
};
const loading = ref(false);
const serverErrors = ref({});
const variantData = computed(() => {
  return {
    menu_item_id: menuItemId,
    variants: variants.value.map((i) => {
      delete i.id;
      return i;
    }),
  };
});
const newVariantsAddedKey = ref(1)
const saveVariants = async () => {
  try {
    loading.value = true;
    const res = await VariantService.create(variantData.value);
    newVariantsAddedKey.value++
    serverErrors.value = {};
    handleReset();
  } catch (error) {
    serverErrors.value = error;
  } finally {
    loading.value = false;
  }
};
const validateAll = async () => {
  const isValid = await validator.value.$validate();
  if (isValid) {
    saveVariants();
    console.log("Validation Passed!", variants.value);
  } else {
    console.log("Validation Failed!", validator.value.$errors);
  }
};
</script>

<style lang="scss" scoped></style>
