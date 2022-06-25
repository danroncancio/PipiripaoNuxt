<script setup>
const config = useRuntimeConfig();
let baseURL = config.strapiUrl || "http://localhost:1337";
const route = useRoute();

let clothing;
let isSub = false;
let category;
let subcategory;

if (route.params.group.includes("-")) {
  category = route.params.group.substring(
    0,
    route.params.group.match(/.+?(?=-)/)[0].length
  );
  subcategory = route.params.group.substring(
    route.params.group.match(/.+?(?=-)/)[0].length + 1,
    route.params.group.length
  );
  isSub = true;
  clothing = await $fetch(`/api/clothing`, {
    method: "GET",
    baseURL,
    params: {
      "filters[Info][Category][$eq]": category,
      "filters[Info][Subcategory][$eq]": subcategory,
      "populate[Info]": "*",
      "populate[ProductImages][populate]": "*",
      "populate[Sizes][populate]": "*",
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });
} else {
  category = route.params.group;
  clothing = await $fetch(`/api/clothing`, {
    method: "GET",
    baseURL,
    params: {
      "filters[Info][Category][$eq]": category,
      "populate[Info]": "*",
      "populate[ProductImages][populate]": "*",
      "populate[Sizes][populate]": "*",
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });
}

console.log(clothing);

let products = []; //
clothing.forEach((ele) => {
  console.log(ele);
  for (let i = 0; i < ele.attributes.ProductImages.length; i++) {
    let currentStock = 0;
    for (let j = 0; j < ele.attributes.Sizes.length; j++) {
      for (let h = 0; h < ele.attributes.Sizes[j].Info.length; h++) {
        if (
          ele.attributes.Sizes[j].Info[h].Color ===
          ele.attributes.ProductImages[i].Color
        ) {
          currentStock = ele.attributes.Sizes[j].Info[h].Stock;
        }
      }
    }
    if (currentStock > 0) {
      products.push({
        SKU: ele.attributes.SKU,
        Info: ele.attributes.Info,
        Color: ele.attributes.ProductImages[i].Color,
        Img1: ele.attributes.ProductImages[i].Images.data[0].attributes.url,
        Img2: ele.attributes.ProductImages[i].Images.data[1].attributes.url,
      });
    }
    console.log(ele.attributes.ProductImages[i].Color);
  }
});
//console.log("final array", products);
</script>

<template>
  <div class="min-h-screen">
    <Nav />
    <section class="mt-14 px-[5%] xl:-mt-1 2xl:px-[10%]">
      <div class="font-polly-bold text-primary">
        <h1 v-if="!isSub" class="text-4xl lg:text-6xl">{{ category }}</h1>
        <h1 v-if="isSub" class="text-4xl lg:text-6xl">{{ subcategory }}</h1>
      </div>
      <div
        class="mt-4 grid grid-cols-1 gap-10 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:grid-cols-3 4xl:grid-cols-4"
      >
        <GarmentCard
          class="mx-auto"
          v-for="(product, index) in products"
          :key="'garm-' + index"
          :title="product.Info.Title"
          :price="product.Info.Price"
          :id="product.SKU"
          :urlImgP="baseURL + product.Img1"
          :urlImgS="baseURL + product.Img2"
          :group="$route.params.group"
          :color="product.Color"
        />
      </div>
    </section>
    <Footer />
  </div>
</template>
