<script setup>
import Scene from "../../components/Scene.vue";
const route = useRoute();
</script>
<template>
  <ClientOnly>
    <Scene />
  </ClientOnly>
</template>
