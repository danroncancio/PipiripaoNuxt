<script setup>
import { Icon } from "@iconify/vue";
import { useCart } from "~~/stores/cart";

const shoppingCart = useCart();
let prevShoppingCart;

const state = reactive({
  subtotal: 0,
});

onMounted(() => {
  //shoppingCart = JSON.parse(localStorage.getItem('shoppingCart') || []);
  //console.log(JSON.parse(localStorage.getItem('shoppingCart')).products.length);
  if (localStorage.getItem("shoppingCart") !== null) {
    shoppingCart.reset();
    JSON.parse(localStorage.getItem("shoppingCart")).products.forEach((ele) => {
      shoppingCart.add(ele);
    });
  }
});

watch(shoppingCart, (newValue) => {
  state.subtotal = 0;
  console.log(newValue);
  if (shoppingCart.products.length > 0) {
    shoppingCart.products.forEach((products) => {
      state.subtotal += products.price * products.quantity;
      localStorage.setItem("shoppingCart", JSON.stringify(newValue));
    });
  } else {
    localStorage.removeItem("shoppingCart");
  }
});
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-10 flex flex-col bg-base-100 px-2 font-polly text-primary xl:static"
  >
    <nav class="navbar">
      <div class="navbar-start">
        <!-- Drawer -->
        <div class="btn btn-ghost btn-circle">
          <Icon icon="fluent:navigation-20-filled" class="h-6 w-6"></Icon>
        </div>
        <!-- Search SmallScr -->
        <div class="btn btn-ghost btn-circle xl:hidden">
          <Icon icon="fluent:search-20-filled" class="h-6 w-6"></Icon>
        </div>
      </div>
      <div class="navbar-center xl:hidden">
        <NuxtLink to="/">
          <img class="w-28" src="/img/logoHeader.png" alt="logo" srcset="" />
        </NuxtLink>
      </div>
      <div class="navbar-end">
        <div class="">
          <label for="" class="btn btn-ghost btn-circle">
            <div class="w-6 rounded-full text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 553.69 519.37"
              >
                <g data-name="Layer 2">
                  <path
                    d="M276.32 496.68c-72.49-1-135.16-18.28-188.14-62.14C26.38 383.38 6.71 306.71 36 232c8.24-21 9-42.34 10.35-64C49 126.94 54.51 86.42 69.52 47.76a103.19 103.19 0 0 1 9.27-18.16c3.87-6 10.2-8.63 16.78-5.32 9.88 4.95 20.05 9.95 28.57 16.82 17.28 14 33.79 28.91 50.11 44 6.89 6.38 13.39 8.2 22.59 5.47 53.29-15.8 106.83-15.9 160.16-.35 10.06 2.93 17.14 1.41 25-5.53 19.81-17.61 40.29-34.45 60.75-51.31 4.23-3.48 9.34-6.07 14.35-8.41 9.17-4.27 16.19-2.79 20.67 6.21a256.74 256.74 0 0 1 16 38.94c11.23 36.82 15.43 74.93 15.78 113.18.22 23.55 8.62 44.56 14.36 66.52 10.3 39.46 10.17 78.58-5.54 116.83-14.82 36.08-40.31 63.09-72.79 83.89-38.73 24.8-81.34 38.58-127 43.13-15.53 1.54-31.16 2.24-42.26 3.01Z"
                    style="
                      fill: none;
                      stroke: #8b575c;
                      stroke-miterlimit: 10;
                      stroke-width: 45.35px;
                    "
                    data-name="Layer 1"
                  />
                </g>
              </svg>
            </div>
          </label>
        </div>
        <!-- Cart -->
        <div class="flex-none">
          <div class="dropdown-end dropdown">
            <label tabindex="0" class="btn btn-ghost btn-circle" for="">
              <div class="indicator">
                <Icon icon="fluent:cart-20-regular" class="h-8 w-8"></Icon>
                <span class="badge indicator-item badge-sm text-base-100">{{
                  shoppingCart.products.length
                }}</span>
              </div>
            </label>
            <div
              tabindex="0"
              class="card dropdown-content card-compact mt-3 w-52 bg-base-100 shadow"
            >
              <div class="card-body">
                <span class="text-lg"
                  >{{ shoppingCart.products.length }} Items</span
                >
                <span class="text-info">Subtotal: ${{ state.subtotal }}</span>
                <div>
                  <NuxtLink to="/cart"
                    ><button class="btn btn-primary btn-block">
                      Ver Carrito
                    </button></NuxtLink
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <nav class="navbar hidden xl:flex">
      <div class="navbar-start"></div>
      <div class="navbar-center flex flex-col">
        <NuxtLink to="/">
          <img class="w-56" src="/img/logoHeader.png" alt="logo" srcset="" />
        </NuxtLink>
        <ul class="menu menu-horizontal z-10 mt-2 gap-3">
          <li tabindex="0">
            <NuxtLink to="/merch-tops">TOPS</NuxtLink>
            <ul class="rounded-box bg-primary p-2 text-base-100">
              <li>
                <NuxtLink to="/merch-tops-buzos">Buzos</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/merch-tops-chaquetas">Chaquetas</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/merch-tops-overoles">Overoles</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/merch-tops-impermeables">Impermeables</NuxtLink>
              </li>
            </ul>
          </li>
          <li>
            <NuxtLink to="/merch-bottoms">BOTTOMS</NuxtLink>
            <ul class="rounded-box bg-primary p-2 text-base-100">
              <li>
                <NuxtLink to="/merch-bottoms-pantalones">Pantalones</NuxtLink>
              </li>
            </ul>
          </li>
          <li tabindex="0">
            <NuxtLink to="/merch-accesorios">ACCESORIOS</NuxtLink>
            <ul class="rounded-box bg-primary p-2 text-base-100">
              <li>
                <NuxtLink to="/merch-accesorios-sombreros">Sombreros</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/merch-accesorios-medias">Medias</NuxtLink>
              </li>
            </ul>
          </li>
          <li><a>VET TODO</a></li>
          <li><a>CONTACTO</a></li>
          <li><a>CATÁLOGO</a></li>
        </ul>
      </div>
      <div class="navbar-end"></div>
    </nav>
  </header>
</template>
