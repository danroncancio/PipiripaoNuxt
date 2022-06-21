<script setup>
import { useCart } from "~~/stores/cart";

useHead({
  script: [{ src: "https://sdk.mercadopago.com/js/v2" }],
});

const baseURL = "http://localhost:1337";
const shoppingCart = useCart();
const state = reactive({
  quantity: 0,
  total: 0,
});

onMounted(() => {
  for (let i = 0; i < shoppingCart.products.length; i++) {
    state.total +=
      shoppingCart.products[i].price * shoppingCart.products[i].quantity;
  }
});
</script>

<template>
  <div class="min-h-screen">
    <Nav />
    <section id="header" class="mt-14 px-[5%] xl:-mt-1 2xl:px-[10%]">
      <div class="font-polly-bold text-primary">
        <h1 class="text-4xl lg:text-6xl">carrito</h1>
        <div class="divider"></div>
        <h3 class="text-xl">productos</h3>
      </div>
    </section>
    <section
      id="cart-products"
      v-for="(product, index) in shoppingCart.products"
    >
      <div
        id="cart-product"
        class="mx-4 my-4 grid grid-cols-2 rounded-md px-2 py-2 shadow"
      >
        <div id="left-grid">
          <img :src="baseURL + product.url" alt="" srcset="" />
        </div>
        <div id="right-grid">
          <h2 class="text-lg">
            <NuxtLink to="/"
              ><strong>{{ product.title }}</strong></NuxtLink
            >
          </h2>
          <p class="mt-1"><strong>Color: </strong> {{ product.color }}</p>
          <p><strong>Talla: </strong> {{ product.size }}</p>
          <p>
            <strong>Precio: </strong>
            {{
              product.price.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
              })
            }}
          </p>
          <p>
            <strong>Cantidad: {{ product.quantity }}</strong>
          </p>
          <select
            v-model="product.quantity"
            name=""
            id=""
            class="select select-accent mt-2 w-full max-w-xs font-polly"
          >
            <option v-for="n in product.stock" :value="n">{{ n }}</option>
          </select>
          <button
            @click="shoppingCart.remove(product.sku, product.color)"
            class="btn btn-accent mt-2"
          >
            Quitar
          </button>
        </div>
      </div>
    </section>
    <section class="px-[5%] xl:-mt-1 2xl:px-[10%]">
      <h2 class="text-xl">
        <strong
          >Total:
          {{
            state.total.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
            })
          }}</strong
        >
      </h2>
    </section>

    <!--
    <div class="mt-10"></div>
    <div v-for="(product, index) in shoppingCart.products" :key="index">
      <h1>{{ product.sku }}</h1>
      <p>{{ product.color }}</p>
      <p>{{ product.quantity }}</p>
      <button
        @click="shoppingCart.remove(product.sku, product.color)"
        class="btn"
      >
        Quitar
      </button>
    </div>
    -->
    <Footer />
  </div>
</template>
