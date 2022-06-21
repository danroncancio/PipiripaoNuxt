<script setup>

import { Box, Camera, LambertMaterial, GltfModel, Plane, PointLight, DirectionalLight, AmbientLight, Renderer, Scene } from 'troisjs';
import { MathUtils, Fog } from 'three';
const components = {Box, Camera, LambertMaterial, GltfModel, Plane, PointLight, DirectionalLight, AmbientLight, Renderer, Scene}

const renderer = ref(null);
const kid = ref(null);
const garment = ref(null);
const scene = ref(null);

let start;
let duration;

onMounted(() => {
	renderer.value.onInit(() => {
		renderer.value.renderFn = () => {
			console.log('hello');
	        scene.value.scene.fog = new Fog(0xFFFFFF, 1, 10);
		}
	})

	renderer.value.onMounted(() => {
		console.log('renderer mounted!');
	    scene.value.scene.fog = new Fog(0xFFFFFF, 1, 10);
	})

	scene.value.scene.fog = new Fog(0xFFFFFF, 10, 100);

	//const orbitCtrl = renderer.value.three.cameraCtrl;
	//orbitCtrl.addEventListener('change', () => {
	//	console.log('moving the camera!');
	//})

	renderer.value.onBeforeRender(() => {
	})
})

function modelLoaded(who) {
	console.log(`the ${who} model loaded!`)
	duration = Date.now() - start;
	console.log(duration);

	kid.value.scene.traverse(o => {
		if (o.isMesh) {
			o.castShadow = true;
			o.receiveShadow = true;
		}
	})
	
	garment.value.scene.traverse(o => {
		if (o.isMesh) {
			o.castShadow = true;
			o.receiveShadow = true;
		}
	})
}

function kidLoading() {
	start = Date.now();
}

function kidError(e) {
	console.error(e);
	
}
const state = reactive({
	show: true,
})
function changeState() {
    state.show = !show;
}

</script>

<template>
	<Renderer ref="renderer" shadow antialias :orbitCtrl="true" :orbit-ctrl="{ autoRotate: false, enableDamping: true, dampingFactor: 0.05 }" :resize="'window'">
		<Camera :position="{z: 1}" />
		<Scene ref="scene" :background="'#FFFDF5'"> 
			<AmbientLight :intensity="0.2" />
			<DirectionalLight :position="{ y: 50, z: 50}" cast-shadow :shadow-map-size="{ width: 512 * 8, height: 512 * 8 }"/>
			<Plane :rotation="{ x: MathUtils.degToRad(-90)}" :position="{ y: -0.5}" :scale="{ x: 6, y: 6, z: 1}" receive-shadow>
				<LambertMaterial color="#FFFDF5" />
			</Plane>
			<GltfModel
				ref="kid"
				src="../assets/models/4/Modelo.gltf"
				@load="modelLoaded('kid')"
				@progress="kidLoading"
				@error="kidError"
				:position="{y: -0.5}"
			/>
			<GltfModel
				v-show="state.show"
				ref="garment"
				src="../assets/models/4/PA0123/Azul/PA0123-Azul.gltf"
				@load="modelLoaded('clothing')"
				@progress="kidLoading"
				@error="kidError"
				:position="{y: -0.5}"
			/>
		</Scene>
	</Renderer>	
	<button @click="state.show = !state.show">Click Me</button>
</template>
