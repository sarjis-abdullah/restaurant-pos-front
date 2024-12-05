<template>
  <form @submit.prevent="validateAll" class="grid gap-2 rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <AddSingleAddon v-for="item in addons" :key="item.id" :variant="item" />
    <header class="flex justify-between text-gray-900 mb-3 text-xl">
      <button
        @click="addNewVariant"
        type="button"
        class="bg-brand-400 text-white px-4 py-2 rounded hover:bg-brand-500"
      >
        <PlusIcon class="h-5 w-5" />
      </button>
      <SpinnerButton
        v-if="addons.length"
        :loading="loading"
        type="submit"
      >
      </SpinnerButton>
    </header>
    <ClientErrors :errors="validator.$errors" />
    <ServerError :error="serverErrors" />
  </form>
  <VariantList :menuItemId="menuItemId" :key="newAddonsAddedKey" />
</template>

<script setup>
import AddSingleAddon from "./AddSingleAddon.vue";
import VariantList from "./List.vue";
import { PlusIcon, FolderIcon } from "@heroicons/vue/20/solid";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import SpinnerButton from "@/components/common/SpinnerButton.vue";
import { AddonService } from "~/services/AddonService";

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
};
const addons = ref([defaultVariant]);

const rules = computed(() => {
  return addons.value.map(() => ({
    name: {
      required: helpers.withMessage("Name is required", required),
    },
    price: {
      required: helpers.withMessage("Price is required", required),
    }
  }));
});

// Using Vuelidate
const validator = useVuelidate(() => rules.value, addons);
const addNewVariant = () => {
  addons.value.push({
    id: addons.value.length + 1,
    name: "",
    price: "",
  });
};
const handleReset = async () => {
  await validator.value.$reset();
  addons.value = [];
  addons.value.push({
    id: 1,
    name: "",
    price: "",
  });
};
const loading = ref(false);
const serverErrors = ref({});
const variantData = computed(() => {
  return {
    menu_item_id: menuItemId,
    addons: addons.value.map((i) => {
      delete i.id;
      return i;
    }),
  };
});
const newAddonsAddedKey = ref(1)
const saveAddons = async () => {
  try {
    loading.value = true;
    const res = await AddonService.create(variantData.value);
    newAddonsAddedKey.value++
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
    saveAddons();
    console.log("Validation Passed!", addons.value);
  } else {
    console.log("Validation Failed!", validator.value.$errors);
  }
};
</script>

<style lang="scss" scoped></style>
