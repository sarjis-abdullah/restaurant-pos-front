<script setup>
import AuthLayout from "../layouts/AuthLayout.vue";
import ErrorMessage from "../components/common/ErrorMessage.vue";
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";
import { CategoryService } from "@/services/CategoryService.js";
import { PlaceService } from "@/services/PlaceService.js";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import { useCategoryStore } from "~/stores/category";
import BaseInput from "@/components/common/BaseInput.vue";
import SpinnerButton from "~/components/common/SpinnerButton.vue";
import SelectBranch from "~/components/branch/SelectBranch.vue";
import { useBranchStore } from "~/stores/branch";

const {variant} = defineProps({
    variant: {
        type: Object,
        default: ()=> ({})
    }
})
const categoryStore = useCategoryStore();
const defaultData = {
  name: "",
  description: "",
};
const serverErrors = ref({});

const branchStore = useBranchStore();
const selectedBranch = computed(() => branchStore.selectedBranch);





</script>

<template>
  <section>
    <section class="grid gap-3">
      <section class="grid grid-cols-2 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500">
            Name<span class="text-red-500">*</span>
          </label>
          <BaseInput v-model="variant.name" type="text" placeholder="e.g. Red" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">
            Price<span class="text-red-500">*</span>
          </label>
          <BaseInput v-model="variant.price" type="text" placeholder="e.g. 10" />
        </div>
      </section>
    </section>
  </section>
</template>
