import * as THREE from 'https://esm.sh/three';
import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.sh/three/examples/jsm/controls/OrbitControls.js';
let SpinningCube;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
scene.add(light);

// Load
const loader = new GLTFLoader();
loader.load('WebHouseTesty.glb', (gltf) => {
    scene.add(gltf.scene);
      SpinningCube = gltf.scene.getObjectByName("spinningcube"); 
}, undefined, (error) => {
    console.error(error);
});

camera.position.z = 5;

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // 👈 add this
    if (SpinningCube) {
    SpinningCube.rotation.y += 0.01; // spin on Y axis
  }
  renderer.render(scene, camera);
}
animate();
