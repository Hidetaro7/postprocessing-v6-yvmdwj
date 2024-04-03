import {
	HalfFloatType,
	PerspectiveCamera,
	Scene,
	VSMShadowMap,
	WebGLRenderer
} from "three";

import {
BloomEffect,
	EffectComposer,
	EffectPass,
	RenderPass,
	ToneMappingEffect
} from "postprocessing";

import { ControlMode, SpatialControls } from "spatial-controls";
import * as CornellBox from "./CornellBox.js";
import * as Utils from "./CameraUtils.js";

/**
 * Creates the scene.
 *
 * @param {Map} assets - Preloaded scene assets.
 */

export function initialize(assets) {

	// Renderer

	const renderer = new WebGLRenderer({
		powerPreference: "high-performance",
		antialias: false,
		stencil: false,
		depth: false
	});

	renderer.setClearColor(0x000000, 1);
	renderer.shadowMap.type = VSMShadowMap;
	renderer.shadowMap.autoUpdate = false;
	renderer.shadowMap.needsUpdate = true;
	renderer.shadowMap.enabled = true;

	const container = document.getElementById("app");
	container.append(renderer.domElement);

	// Scene, Camera and Controls

	const scene = new Scene();
	const camera = new PerspectiveCamera();
	const { position, quaternion } = camera;
	const controls = new SpatialControls(position, quaternion, renderer.domElement);
	const settings = controls.settings;
	settings.general.mode = ControlMode.THIRD_PERSON;
	settings.translation.enabled = false;
	settings.rotation.sensitivity = 2.2;
	settings.rotation.damping = 0.05;
	settings.zoom.sensitivity = 0.25;
	settings.zoom.damping = 0.1;
	settings.zoom.setRange(1, 10);
	controls.position.set(0, 0, 4);

	// Lights & Objects

	scene.add(CornellBox.createLights());
	scene.add(CornellBox.createEnvironment());
	scene.add(CornellBox.createActors());

	// Post Processing

const bloom = new BloomEffect();
bloom.intensity = 10
	const renderPass = new RenderPass(scene, camera);
	const effectPass = new EffectPass(camera, bloom);

	const composer = new EffectComposer(renderer, {
		frameBufferType: HalfFloatType,
		multisampling: 4
	});

	composer.addPass(renderPass);
	composer.addPass(effectPass);
console.log(bloom.intensity)
	// Resizing

	function onResize(event) {

		const width = container.clientWidth;
		const height = container.clientHeight;
		camera.aspect = width / height;
		camera.fov = Utils.calculateVerticalFoV(90, Math.max(camera.aspect, 16 / 9));
		camera.updateProjectionMatrix();
		composer.setSize(width, height);

	}

	window.addEventListener("resize", onResize);
	onResize();

	// Render Loop

	requestAnimationFrame(function render(timestamp) {

		requestAnimationFrame(render);
		controls.update(timestamp);
		composer.render();

	});

}
