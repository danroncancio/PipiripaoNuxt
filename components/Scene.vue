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
    "/models/4/CT7527/Blanco.glb",
    "/models/4/CT7527/Negro.glb",
    "/models/4/OF0426/Blanco.glb",
    "/models/4/OF0426/Negro.glb",
  ],
  // 6
  "/models/6/Modelo.glb": [
    "/models/6/PC0426/Rojo.glb",
    "/models/6/PC0426/Negro.glb",
  ],
  // 8
  "/models/8/Modelo.glb": [
    "/models/8/PC0426/Rojo.glb",
    "/models/8/PC0426/Gris.glb",
  ],
};

const canvas = ref(null);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(1, 1, 1);

let renderer;
let controls;
const raycaster = new THREE.Raycaster();
raycaster.layers.set(0);
const pointer = new THREE.Vector2(1, 1);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
directionalLight.layers.set(0);
scene.add(directionalLight);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6),
  new THREE.MeshLambertMaterial({ color: "#FFFDF5" })
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
      node.layers.set(0);
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
      //clothesGroup.add(res.scene);
      //console.log("resp obj: ", res);
      res.scene.traverse((node) => {
        node.layers.set(0);
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
}

function createScene(el) {
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = false;
  controls.target = new THREE.Vector3(0, 0.65, 0);

  resize();
  animate();
}

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

onMounted(() => {
  createScene(canvas.value);
});

window.addEventListener("resize", resize);
window.addEventListener("click", onPointerClick);
window.addEventListener("pointermove", onPointerMove);
//window.addEventListener("touchstart", onPointerTouch);
</script>

<template>
  <button @click="changeGarment">Click Me!</button>
  <button @click="showScene">Scene Me!</button>
  <button @click="showGroups">Groups Me!</button>
  <div></div>
  <button @click="getModelsUrl('4')">4</button>
  <button @click="getModelsUrl('6')" class="ml-2">6</button>
  <button @click="getModelsUrl('8')" class="ml-2">8</button>
  <canvas ref="canvas"></canvas>
</template>
