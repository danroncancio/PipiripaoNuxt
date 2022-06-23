<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const modules = ref([Navigation, Autoplay]);
const components = { Swiper, SwiperSlide };

const config = useRuntimeConfig();
let baseURL =
  process.env.NUXT_STRAPI_URL || config.strapiUrl || "http://localhost:1337";

const state = reactive({
  slideNumber: 4,
});

const carousel = await $fetch("/api/carousel", {
  method: "GET",
  baseURL,
  params: {
    populate: "*",
    "filters[Type][$eq]": "BottomCarousel",
  },
})
  .then((res) => {
    return res.data[0].attributes.Images.data;
  })
  .catch((err) => {
    console.error(err);
  });

onMounted(() => {
  if (window.innerWidth < 1280) state.slideNumber = 2;
  window.addEventListener("resize", resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler);
});

function resizeHandler(e) {
  if (e.currentTarget.innerWidth < 1280) {
    state.slideNumber = 2;
  } else {
    state.slideNumber = 4;
  }
}
</script>

<template>
  <swiper
    :slidesPerView="state.slideNumber"
    :loop="true"
    :spaceBetween="6"
    :modules="modules"
    :autoplay="{
      delay: 2500,
      disableOnInteraction: false,
    }"
    class="mySwiper mt-12 h-[8rem] xl:h-[22rem] xl:w-8/12"
  >
    <swiper-slide v-for="img in carousel" :key="img.id">
      <img
        class="h-full w-full object-cover xl:rounded-box"
        :src="baseURL + img.attributes.url"
        alt="'img' + img.id"
        srcset=""
      />
    </swiper-slide>
  </swiper>
</template>

<style scoped></style>
