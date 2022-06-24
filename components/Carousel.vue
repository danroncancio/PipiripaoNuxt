<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const modules = ref([Navigation, Pagination, EffectFade, Autoplay]);
const components = { Swiper, SwiperSlide };

const config = useRuntimeConfig();
let baseURL =
  process.env.NUXT_STRAPI_URL || config.strapiUrl || "http://localhost:1337";

const carousel = await $fetch("/api/carousels", {
  method: "GET",
  baseURL,
  params: {
    populate: "*",
  },
})
  .then((res) => {
    return res.data[0].attributes.Images.data;
  })
  .catch((err) => {
    console.error(err);
  });
</script>

<template>
  <swiper
    :loop="true"
    :spaceBetween="30"
    :effect="'fade'"
    :navigation="true"
    :autoplay="{
      delay: 2500,
      disableOnInteraction: false,
    }"
    :pagination="{
      clickable: true,
    }"
    :modules="modules"
    class="mySwiper mt-16 h-[22rem] xl:rounded-box xl:-mt-1 xl:h-[36rem] xl:w-8/12"
  >
    <swiper-slide v-for="img in carousel" :key="img.id">
      <img
        class="h-full w-full object-cover"
        :src="baseURL + img.attributes.url"
        alt="'img' + img.id"
        srcset=""
      />
    </swiper-slide>
  </swiper>
</template>

<style scoped></style>
