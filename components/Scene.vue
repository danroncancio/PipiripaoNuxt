<script setup>
import * as THREE from 'three'
import { MathUtils } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = ref(null);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1, 1, 1);

let renderer;
let controls;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add( directionalLight );

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry( 6, 6),
	new THREE.MeshLambertMaterial({ color: '#FFFDF5'})
)
floor.receiveShadow = true;
floor.rotation.x = MathUtils.degToRad(-90);
scene.add(floor);


let urls = [];
urls.push('../assets/models/4/PA0123/Azul/PA0123-Azul.gltf');
urls.push('../assets/models/4/PA0123/Negro/Negro1.gltf');

let models = {};
let activeGarmentID;

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('../assets/models/draco/gltf/');
loader.setDRACOLoader(dracoLoader);

// Load kid model 
let kidUrl = '../assets/models/4/Modelo.gltf';
loadModel(kidUrl).then((res) => {
	res.scene.traverse((node) => {
		if (node.isMesh) {
			node.castShadow = true;
			node.receiveShadow = true;
		}
	})
    scene.add(res.scene);
});

for (let i = 0; i < urls.length; i++) {
	loadModel(urls[i]).then(res => {
		res.scene.traverse((node) => {
			if (node.isMesh) {
				node.castShadow = true;
				node.receiveShadow = true;
			}
		})
		if (i === 0) { 
			activeGarmentID = res.scene.uuid;
		    scene.add(res.scene);
		}
		//scene.add(res.scene)
	});
	console.log(urls[i]);
}

function loadModel(url) {
	if (models[url]) {
		return models[url];
	}

	return models[url] = loader.loadAsync(url, (e) => {
	})
}

function changeGarment() {
	loadModel('../assets/models/4/PA0123/Negro/Negro1.gltf').then(res => {
		let prevGarmentObj = scene.getObjectByProperty('uuid', activeGarmentID);
		scene.remove()
		scene.add(res.scene);
	})
}

function showScene() {
	console.log(scene)
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	controls.update();
}

function createScene(el) {
	renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el});
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    controls = new OrbitControls(camera, renderer.domElement);
	controls.autoRotate = false;
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
})

window.addEventListener('resize', resize);

</script>

<template>
	<button @click="changeGarment">Click Me!</button>
	<button @click="showScene"> Scene Me!</button>
	<canvas ref="canvas"></canvas>
</template>
