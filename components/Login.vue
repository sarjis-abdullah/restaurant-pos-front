<template>
  <section class="flex items-center justify-center h-screen">
    <div class="p-4 w-[28rem] mx-auto shadow-2xl">
      <section class="p-4">
        <form @submit.prevent="submitForm" class="grid gap-2">
          <!-- email -->
          <div class="grid gap-2" :style="style">
            <label for="email" class="block font-bold">Email</label>
            <BaseInput
              type="email"
              v-model="state.email"
              placeholder="e.g. test@mart.com"
            />
          </div>

          <!-- Email -->
          <div class="grid gap-2" :style="style">
            <label for="password" class="block font-bold">Password</label>
            <BaseInput type="password" v-model="state.password" />
          </div>

          <SpinnerButton
            type="submit"
            :loading="loading"
            :defaultText="'Login'"
            :loadingText="'Logging In...'"
            extraClass="mt-4"
          >
          </SpinnerButton>
        </form>
      </section>
      <div class="text-center">
        <ServerError :error="serverErrors" />
        <ClientErrors :errors="validator.$errors" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import Login from "../components/Login.vue";
import { authUser, superAdmin, operator } from "~/hooks/useMenu";
import BaseInput from "@/components/common/BaseInput.vue";
import SpinnerButton from "@/components/common/SpinnerButton.vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";
import { UserService } from "@/services/UserService.js";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";

const route = useRoute();
const router = useRouter();

const config = useRuntimeConfig();
const url = config.public.DEVELOPMENT_API_URL + "login";
const style = "";
const defaultData = {
  password: "",
  email: "",
};
const formData = ref({ ...defaultData });
const state = reactive(defaultData);

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("Email is required", required),
      email: helpers.withMessage("Email is not valid!", email),
    },
    password: {
      required: helpers.withMessage("Password is required", required),
    },
  };
});
const validator = useVuelidate(rules, state, { $lazy: true });

const errors = ref({});
const loading = ref(false);
const serverErrors = ref({});

const loginUser = async () => {
  try {
    loading.value = true;
    const data = await UserService.login(state);
    console.log(data);
    if (data.user && window && window.localStorage) {
      localStorage.setItem("LOGIN_ACCOUNT", JSON.stringify(data.user));
      localStorage.setItem("ACCESS_TOKEN", data.accessToken);
      router.push("/user");
      // if (data.user?.roles?.find((item) => item?.name == "operator")) {
      //   router.push("/cashflow");
      // } else router.push("/dashboard");
      // Reload the page
      // window.location.reload();
    }
  } catch (error) {
    if (error.errors) {
      serverErrors.value = error.errors;
    }
  } finally {
    loading.value = false;
  }
};
const submitForm = async () => {
  const r = await validator.value.$validate();
  if (r) {
    loginUser();
    return;
  }
  console.log("Please fill out the form");
};
</script>
