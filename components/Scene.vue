<script setup>
import * as THREE from "three";
import { MathUtils } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const route = useRoute();
let activeSize = "4";
let activeColor = "";
let activeKidUrl = "";
let activeSKU = route.query.sku;

const state = reactive({
  didInter: false,
});

// TODO: This is retarded.
const modelUrls = {
  // 4
  "/models/4/Modelo.glb": [
    "/models/4/CT7527/Crema.glb",
    //
    "/models/4/BC5600/Naranja.glb",
    "/models/4/BC5600/Verde.glb",
    //
    "/models/4/CC1815/Azul.glb",
    "/models/4/CC1815/Roja.glb",
    //
    "/models/4/CI5527/Azul.glb",
    "/models/4/CI5527/Cafe.glb",
    //
    "/models/4/OF5600/Verde.glb",
    "/models/4/OF5600/Vino.glb",
    //
    "/models/4/PC7527/Crema.glb",
    "/models/4/PC7527/Negro.glb",
  ],
  // 6
  "/models/6/Modelo.glb": [
    "/models/6/CT7527/Crema.glb",
    "/models/6/CT7527/Negro.glb",
    //
    "/models/6/BC5600/Naranja.glb",
    "/models/6/BC5600/Verde.glb",
    //
    "/models/6/CC1815/Azul.glb",
    "/models/6/CC1815/Roja.glb",
    //
    "/models/6/CI5527/Azul.glb",
    "/models/6/CI5527/Cafe.glb",
    //
    "/models/6/OF5600/Verde.glb",
    "/models/6/OF5600/Vino.glb",
    //
    "/models/6/PC7527/Crema.glb",
    "/models/6/PC7527/Negro.glb",
  ],
  // 8
  "/models/8/Modelo.glb": [
    "/models/8/CT7527/Crema.glb",
    "/models/8/CT7527/Negro.glb",
    //
    "/models/8/BC5600/Naranja.glb",
    "/models/8/BC5600/Verde.glb",
    //
    "/models/8/CC1815/Azul.glb",
    "/models/8/CC1815/Roja.glb",
    //
    "/models/8/CI5527/Azul.glb",
    "/models/8/CI5527/Cafe.glb",
    //
    "/models/8/OF5600/Verde.glb",
    "/models/8/OF5600/Vino.glb",
    //
    "/models/8/PC7527/Crema.glb",
    "/models/8/PC7527/Negro.glb",
  ],
};

const canvas = ref(null);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog("#b7faed", 1, 5);
scene.background = new THREE.Color("#b7faed");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0.5, 1.5, 1);

let renderer;
let controls;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(1, 1);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

let ligthsGroup = new THREE.Group();

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024 * 4, 1024 * 4);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
ligthsGroup.add(directionalLight);
scene.add(ligthsGroup);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshLambertMaterial({ color: "#f482c5" })
);
floor.receiveShadow = true;
floor.rotation.x = MathUtils.degToRad(-90);
scene.add(floor);

let urls = [];

let models = {}; // array for the loadModels function
let activeGarmentID;
let activeGarmentIndex;

let kidModel;

let clothesGroup = new THREE.Group();

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("../assets/models/draco/gltf/");
loader.setDRACOLoader(dracoLoader);

function getModelsUrl(size) {
  activeSize = size;
  switch (activeSize) {
    case "4":
      controls.target.set(0, 0.65, 0);
      break;
    case "6":
      controls.target.set(0, 0.75, 0);
      break;
    case "8":
      controls.target.set(0, 0.9, 0);
      break;
    default:
      break;
  }
  for (let key in modelUrls) {
    if (key.includes(size)) {
      activeKidUrl = key;
      for (let j = 0; j < modelUrls[key].length; j++) {
        if (modelUrls[key][j].includes(activeSKU)) {
          urls.push(modelUrls[key][j]);
        }
      }
    }
  }
  console.log(activeSKU, " ", activeSize, " ", activeKidUrl);
  console.log(urls);
  loadKid(activeKidUrl);
  loadGarments(urls);
}

// Load kid model
function loadKid(url) {
  let kidUrl = url;
  loadModel(kidUrl).then((res) => {
    res.scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    kidModel = res.scene;
    console.log(kidModel.position);
    scene.add(kidModel);
  });
}

function loadGarments() {
  console.log("length: ", urls.length);
  for (let i = 0; i < urls.length; i++) {
    loadModel(urls[i]).then((res) => {
      res.scene.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      if (i === 0) {
        activeGarmentID = res.scene.uuid;
        scene.add(res.scene);
        activeGarmentIndex = 0;
      }
      //console.log("Grupo: ", clothesGroup);
    });
    //console.log(urls[i]);
  }
}

function loadModel(url) {
  if (models[url]) {
    return models[url];
  }
  return (models[url] = loader.loadAsync(url, (e) => {}));
}

function changeGarment() {
  let prevGarmentObj = scene.getObjectByProperty("uuid", activeGarmentID);
  activeGarmentIndex += 1;
  if (urls[activeGarmentIndex] === undefined) {
    activeGarmentIndex = 0;
  }

  loadModel(urls[activeGarmentIndex]).then((res) => {
    console.log(res);
    scene.remove(prevGarmentObj);
    scene.add(res.scene);
    activeGarmentID = res.scene.uuid;
    //state.didInter = false;
  });
}

function showScene() {
  console.log(scene);
}

function showGroups() {
  console.log(clothesGroup);
}

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  //console.log(pointer);
}

function onPointerClick(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  if (activeGarmentID !== undefined) {
    const object3D = scene.getObjectByProperty("uuid", activeGarmentID);
    const intersects = raycaster.intersectObject(object3D, true);
    if (intersects.length > 0) {
      changeGarment();
    }
  }
}

function onPointerTouch(event) {
  console.log("touch ", event);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  raycaster.setFromCamera(pointer, camera);
  ligthsGroup.rotation.y += 0.001;
  resize();
}

function createScene(el) {
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxDistance = 1;
  controls.minDistance = 0.3;
  controls.enablePan = true;
  controls.autoRotate = false;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = 0.9;
  controls.target = new THREE.Vector3(0, 0.65, 0);

  resize();
  animate();
}

function resize() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

onMounted(() => {
  createScene(canvas.value);
  document.getElementById("tallasToggle").click();
  console.log("window sizes: ", window.innerWidth, " ", window.innerHeight);
  resize();
});
window.addEventListener("resize", resize);
window.addEventListener("mousedown", onPointerClick);
window.addEventListener("pointermove", onPointerMove);

//window.addEventListener("touchstart", onPointerTouch);
</script>

<template>
  <div class="relative">
    <img
      class="absolute z-10 ml-4 mt-4 w-36"
      src="/img/logoSecondary.png"
      alt=""
    />
    <label
      id="tallasToggle"
      for="tallas-modal"
      class="modal-button absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2"
      >Elegir Talla</label
    >
    <canvas ref="canvas"></canvas>
    <input type="checkbox" id="tallas-modal" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box max-w-xs">
        <h3 class="pb-4 text-lg">Seleccionar la talla</h3>
        <div class="mx-auto flex justify-between px-4">
          <label
            @click="getModelsUrl('4')"
            for="tallas-modal"
            class="btn btn-primary btn-circle text-2xl"
            >4</label
          >
          <label
            @click="getModelsUrl('6')"
            for="tallas-modal"
            class="btn btn-primary btn-circle text-2xl"
            >6</label
          >
          <label
            @click="getModelsUrl('8')"
            for="tallas-modal"
            class="btn btn-primary btn-circle text-2xl"
            >8</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
html,
body {
  overflow: hidden;
}

canvas {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
}
</style>
