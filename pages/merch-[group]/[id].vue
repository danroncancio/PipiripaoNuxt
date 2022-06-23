<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper";
import { useCart } from "~~/stores/cart";

import MarkdownIt from "markdown-it";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const config = useRuntimeConfig();
let baseURL = config.strapiUrl || "http://localhost:1337";
const route = useRoute();

const modules = ref([Navigation, Pagination, EffectFade, Autoplay]);
const components = { Swiper, SwiperSlide };

const shoppingCart = useCart();
const state = reactive({
  quantity: 0,
  subtotal: 0,
  activeSize: "",
  activeColor: "",
  outOfStock: [],
  sizeColors: [],
  imgColors: [],
  stockList: [],
});

const content = ref("");

onMounted(() => {
  const md = new MarkdownIt();
  content.value = md.render(garment.Info.Information);
});

const garment = await $fetch(`/api/clothing`, {
  method: "GET",
  baseURL,
  params: {
    "filters[SKU][$eq]": `${route.params.id}`,
    "populate[Info]": "*",
    "populate[Sizes][populate]": "*",
    "populate[ProductImages][populate]": "*",
  },
})
  .then((res) => {
    return res.data[0].attributes;
  })
  .catch((err) => {
    console.error(err);
  });

const guide = await $fetch(`/api/sizes-guide`, {
  method: "GET",
  baseURL,
  params: {
    populate: "*",
  },
})
  .then((res) => {
    return res.data.attributes.Guide.data.attributes.url;
  })
  .catch((err) => {
    console.error(err);
  });

// Garment Colors
garment.ProductImages.forEach((col) => {
  col.Images.data.forEach((img) => {
    state.imgColors.push({
      colorName: col.Color,
      url: img.attributes.url,
    });
  });
});

// Sizes
garment.Sizes.forEach((el, i) => {
  //console.log(el);
  let totalStock = 0;
  el.Info.forEach((col, j) => {
    console.log(col, j);
    if (col.Stock > 0 && state.activeSize === "") {
      setActiveColor(col.Color, col.Stock);
      setActiveSize(el.SizeName.replace(/\'/g, ""));
      for (let k = 1; k <= col.Stock; k++) {
        state.stockList.push(k);
      }
    }
    state.sizeColors.push({
      size: el.SizeName.replace(/\'/g, ""),
      color: col.Color,
      stock: col.Stock,
    });
    totalStock += col.Stock;
  });
  if (totalStock > 0) {
    state.outOfStock.push("N");
  } else {
    state.outOfStock.push(el.SizeName.replace(/\'/g, ""));
  }
});

if (route.query.color !== undefined) {
    for (let i = 0; i < state.sizeColors.length; i++) {
        if (route.query.color === state.sizeColors[i].color) {
            setActiveSize(state.sizeColors[i].size);
            setActiveColor(route.query.color, state.sizeColors[i].stock);
            break;
        }
    }
    console.log('testIMages', state.sizeColors);
}

function setActiveColor(color, stock) {
  state.stockList = [];
  getSubtotal(0);
  state.quantity = 0;
  state.activeColor = color;
  for (let i = 1; i <= stock; i++) {
    state.stockList.push(i);
  }
}

function setActiveSize(size) {
  state.activeSize = size;
  getSubtotal(0);
  for (let i = 0; i < state.sizeColors.length; i++) {
    if (state.sizeColors[i].size === size && state.sizeColors[i].stock > 0) {
      state.activeColor = state.sizeColors[i].color;
      break;
    }
  }
  state.stockList = [];
}

function getSubtotal(quantity) {
  state.subtotal = garment.Info.Price * quantity;
}

function addCart(sku, url, title, size, color, quantity, stock, price) {
  if (quantity === 0 || quantity === undefined) {
    alert("asdf ", quantity);
    return false;
  } else {
    let product = {
      sku,
      url,
      title,
      size,
      color,
      quantity,
      stock,
      price,
    };
    shoppingCart.add(product);
  }
}
</script>

<template>
  <div class="min-h-screen">
        <Nav />
        <section class="mx-3 md:mx-10 mt-20 xl:-mt-1 text-primary xl:mx-auto xl:w-8/12 md:grid md:grid-cols-3 md:gap-2">
            <div id="images" class="grid gap-1 grid-cols-2 my-4 md:col-span-2">
                <template v-for="(img, index) in state.imgColors" :key="'img-' + index">
                    <div v-show="img.colorName === state.activeColor" class="h-[17rem] md:h-[20rem]">
                        <img class="object-cover h-full w-full" :src="baseURL + img.url">
                    </div>
                </template>
            </div>
            <div class="mt-2 pl-2 md:sticky">
                <h1 id="title" class=" text-3xl font-polly-bold text-accent">{{ garment.Info.Title }}</h1>
                <p class="font-polly text-secondary">SKU: {{ garment.SKU }}</p>
                <h2 id="price" class="mt-3 font-polly-bold text-2xl">{{ garment.Info.Price.toLocaleString('es-CO', {
                        style: 'currency', currency: 'COP', minimumFractionDigits: 0
                    })
                }}</h2>
                <section id="sizes" class="mt-4 font-polly-bold">
                    <h2>Tallas</h2>
                    <div class="mt-3 flex md:grid">
                        <div>
                            <button v-for="(size, index) in garment.Sizes" :key="'size-' + index"
                                :id="'size-' + size.SizeName.replace(/\'/g, '')"
                                class="btn btn-secondary btn-circle font-polly md:text-lg text-xl mx-2 md:mx-1" :class="
                                    state.activeSize === size.SizeName.replace(/\'/g, '') && 'btn-active text-base-100',
                                    state.outOfStock[index] === size.SizeName.replace(/\'/g, '') && 'btn-disabled'
                                "
                                @click="setActiveSize(size.SizeName.replace(/\'/g, '')); setActiveColor(size.Info[0].Color, size.Info[0].Stock);">
                                {{ size.SizeName.replace(/\'/g, "") }}
                            </button>
                        </div>
                        <label for="modal" class="btn btn-accent modal-button md:mt-3 md:w-20">Guía</label>
                    </div>
                    <div id="Colors" class="mt-4">
                        <h2>Colores</h2>
                        <div class="mt-2">
                            <button v-for="(color, index) in state.sizeColors" :key="'color-' + index"
                                :id="'color-' + color.size + '-' + color.color"
                                class="btn btn-secondary font-polly text-xl md:text-lg mx-2 md:mx-1" :class="
                                    state.activeColor === color.color && 'btn-active text-base-100',
                                    color.stock <= 0 && 'btn-disabled',
                                    color.size !== state.activeSize && 'hidden'
                                " @click="setActiveColor(color.color, color.stock)">
                                {{ color.color }}
                            </button>
                        </div>
                    </div>
                </section>
                <div class="font-polly">
                    <div id="Cantidad" class="mt-4">
                        <h2 class="font-polly-bold">Cantidad</h2>
                        <select v-model="state.quantity" class="select select-accent w-full max-w-xs mt-2 font-polly">
                            <option value="0" disabled selected="selected">Seleccionar cantidad</option>
                            <option v-for="(i, index) in state.stockList" :key="'color-' + index"
                                :value="state.stockList[index]" @click="getSubtotal(state.quantity)">
                                {{ state.stockList[index] }}
                            </option>
                        </select>
                        <h3 class="mt-1 text-lg">Subtotal: {{ state.subtotal.toLocaleString('es-CO', {
                                style: 'currency', currency: 'COP', minimumFractionDigits: 0
                            })
                        }}</h3>
                    </div>
                    <div class="mt-6 w-full">
                        <div class="collapse collapse-plus">
                            <input type="checkbox" class="peer" />
                            <div class="collapse-title bg-base-100 text-xl peer-checked:bg-base-200">
                                <h3 class="font-polly-bold">INFORMACIÓN</h3>
                            </div>
                            <article class="collapse-content bg-base-100 prose peer-checked:bg-base-200">
                                <div v-html="content" />
                            </article>
                        </div>
                    </div>
                </div>
                <div id="Buy" class="mt-4">
                    <button class="btn btn-primary text-center text-2xl font-polly-bold w-full"
                        @click="addCart(garment.SKU, state.imgColors[0].url, garment.Info.Title, state.activeSize, state.activeColor, state.quantity, state.stockList.length, garment.Info.Price)">
                        Agregar
                    </button>
                </div>
            </div>
        </section>
        <Footer />
        <input type="checkbox" id="modal" class="modal-toggle" />
        <div class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <h3 class="font-bold text-lg">Guía de Tallas</h3>
                <!--<img :src="baseURL + guide" alt="">-->
                <LazyClientOnly>
                  <Scene />
                </LazyClientOnly>
                <div class="modal-action">
                    <label for="modal" class="btn btn-primary">Meow!</label>
                </div>
            </div>
        </div>
    </div>
</template>
