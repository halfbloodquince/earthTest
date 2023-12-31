import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//Texutures

const textureLoader = new THREE.TextureLoader();
const dayTexture = textureLoader.load("/textures/8k_earth_daymap.jpg");
const nightTexture = textureLoader.load("/textures/8k_earth_nightmap.jpg");
const earthNormal = textureLoader.load("/textures/8k_earth_normal_map.jpg");
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// ...

const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Object
 */
const geometry = new THREE.SphereGeometry(1, 64, 32);
// const material = new THREE.MeshBasicMaterial({ map: texture });
const material = new THREE.MeshStandardMaterial({
  map: nightTexture,
});
material.normalMap = earthNormal;
material.normalScale.set(1, 1);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//Pin

const coords = [
  { london: [51.5072, 0.1276] },
  { berlin: [52.5206, -13.404] },
  { la: [34.0549, 119.2426] },
  { sydney: [-33.8688, -151.2093] },
  { marl: [51.6591, -7.106] },
  { portRush: [55.2042, 6.6527] },
];
console.log(Object.keys(coords).length);

coords.forEach((country) => {
  let pinMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.005, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  let coordinates = country[Object.keys(country)[0]];
  console.log(coordinates);
  let lat = coordinates[0];
  let long = coordinates[1];

  console.log(lat);

  let latitutde = (lat * Math.PI) / 180;
  let longitude = (long * Math.PI) / 180;

  let x = Math.cos(latitutde) * Math.cos(longitude);
  let y = Math.sin(latitutde);
  let z = Math.cos(latitutde) * Math.sin(longitude);
  console.log(x, y, z);

  pinMesh.position.set(x, y, z);
  scene.add(pinMesh);
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
