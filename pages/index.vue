<script setup>
const config = useRuntimeConfig();
let baseURL = config.strapiUrl || "http://localhost:1337";

// fetching the body images
const images = await $fetch("/api/carousel", {
  method: "GET",
  baseURL,
  params: {
    populate: "*",
    "filters[Type][$eq]": "MidImages",
  },
})
  .then((res) => {
    return res.data[0].attributes.Images.data;
  })
  .catch((err) => {
    console.error(err);
  });
console.log(images);
</script>

<template>
  <div class="min-h-screen">
    <Nav />
    <Carousel />
    <div
      class="h-10 w-full justify-center font-polly-bold text-xl text-secondary xl:text-4xl"
    >
      <p class="pt-8 text-center">TEXTO IMPORTANTE</p>
    </div>
    <section id="content" class="my-12 xl:mt-14">
      <div
        class="relative mx-auto flex h-[22rem] gap-1 xl:h-[36rem] xl:w-8/12 xl:gap-2"
      >
        <img
          class="h-full w-full object-cover xl:rounded-box"
          v-for="image in images"
          :key="image.attributes.id"
          :src="baseURL + image.attributes.url"
          alt=""
          srcset=""
        />
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform font-polly-bold text-5xl text-primary xl:text-9xl"
        >
          DESCUBRE
        </div>
      </div>
    </section>
    <SecondCarousel />
    <Footer />
  </div>
</template>
