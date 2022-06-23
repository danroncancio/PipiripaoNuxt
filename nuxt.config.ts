import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      strapiUrl: process.env.NUXT_STRAPI_URL,
    },
  },
  nitro: {
    preset: "node-server",
  },
});
