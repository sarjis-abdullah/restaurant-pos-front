// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    DEVELOPMENT_API_URL: process.env.DEVELOPMENT_API_URL,
    APP_URL: process.env.APP_URL,
    public: {
      DEVELOPMENT_API_URL: process.env.DEVELOPMENT_API_URL,
      APP_URL: process.env.APP_URL,
      apiBase: "", // can be overridden by NUXT_PUBLIC_API_BASE environment variable
    },
  },

  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  nitro: {
    // plugins: ["~/server/index.js"],
  },

  modules: ['@pinia/nuxt', 'nuxt-headlessui'],

  devServer: {
    // for check in mbl device
    port: 3001, // default: 3000
    host: '0.0.0.0', // default: localhost
  },

  compatibilityDate: '2024-12-03',
});