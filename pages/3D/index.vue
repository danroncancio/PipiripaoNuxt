<script setup>
import Scene from "../../components/Scene.vue";
const route = useRoute();
useHead({
  title: "3D Pipiripao",
  // or, instead:
  // titleTemplate: (title) => `My App - ${title}`,
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1",
  charset: "utf-8",
  meta: [
    {
      name: "Descripcion",
      content: "Plataforma para la vista en 3D de la linea de ropa Pipiripao",
    },
  ],
});
</script>
<template>
  <div class="min-h-screen">
    <ClientOnly>
      <Scene />
    </ClientOnly>
  </div>
</template>

<style scoped>
html,
body {
  overflow: hidden;
}
.webgl {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
}
canvas {
  display: block;
}
</style>
