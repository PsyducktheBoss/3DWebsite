import * as THREE from 'https://esm.sh/three';
import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.sh/three/examples/jsm/controls/OrbitControls.js';

let SpinningCube;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
scene.add(light);

// Load GLB
const loader = new GLTFLoader();
loader.load('StudioStation9GLB.glb', (gltf) => {
  scene.add(gltf.scene);
  SpinningCube = gltf.scene.getObjectByName("spinningcube");
}, undefined, (error) => {
  console.error(error);
});

// OrbitControls Setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;       
controls.enablePan = false;        
controls.rotateSpeed = 0.5;
controls.dampingFactor = 0.1;
controls.target.set(0, 0, 0);
controls.minPolarAngle = Math.PI / 2; 
controls.maxPolarAngle = Math.PI / 2;
camera.position.set(0, 50, 5);

// Vertical drag to move camera up/down
let isDragging = false;
let previousMouseY = 0;
const verticalLimit = { min: -4, max: 6 };

renderer.domElement.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousMouseY = e.clientY;
});

renderer.domElement.addEventListener('mouseup', () => {
  isDragging = false;
});

renderer.domElement.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const deltaY = e.clientY - previousMouseY;
  previousMouseY = e.clientY;

  const moveSpeed = 0.01;
  let newY = camera.position.y - deltaY * moveSpeed;
  newY = Math.max(verticalLimit.min, Math.min(verticalLimit.max, newY));
  camera.position.y = newY;

  // Move OrbitControls' target to keep the view level
  controls.target.y = newY;
});

renderer.domElement.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (SpinningCube) {
    SpinningCube.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}
animate();
