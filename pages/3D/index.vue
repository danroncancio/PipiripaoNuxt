<script setup>
const route = useRoute();
console.log("3D");
console.log(route.query.sku);
</script>
<template>
  <ClientOnly>
    <Scene />
  </ClientOnly>
  <Footer />
</template>
