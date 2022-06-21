<script setup lang="ts">
defineProps<{
  urlImgP?: string;
  urlImgS?: string;
  title: string;
  price: number;
  id: string;
  group: string;
  color: string;
}>();

//let priceFormat: string = price.toLocaleString()
</script>

<template>
  <div
    class="card-compact card w-80 bg-white shadow md:w-[22rem] 2xl:w-[26rem] 3xl:w-[28rem] 4xl:w-[30rem]"
  >
    <figure class="relative">
      <img
        class="h-[28rem] w-full object-cover object-center"
        :src="urlImgP"
        alt=""
        srcset=""
      />
      <img
        class="absolute h-[28rem] w-full object-cover object-center opacity-0 hover:opacity-100"
        :src="urlImgS"
        alt=""
        srcset=""
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ title }}</h2>
      <p class="text-lg">
        {{
          price.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          })
        }}
      </p>
      <div class="card-actions justify-end">
        <NuxtLink :to="`/merch-${group}/${id}?color=${color}`"
          ><button class="btn btn-primary">Ver Detalles</button></NuxtLink
        >
      </div>
    </div>
  </div>
</template>
