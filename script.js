import * as THREE from 'https://esm.sh/three';
import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';

let SpinningCube;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
scene.add(light);

// Load model
const loader = new GLTFLoader();
loader.load('StudioStation9GLB.glb', (gltf) => {
    scene.add(gltf.scene);
    SpinningCube = gltf.scene.getObjectByName("spinningcube");
}, undefined, (error) => {
    console.error(error);
});

// Orbit settings
const target = new THREE.Vector3(0, 0, 0);
let radius = 5;
let theta = 0; // horizontal angle
let phi = Math.PI / 2; // vertical angle (polar)

// Limits
const verticalLimit = { min: -2, max: 2 }; // camera Y position limit

// Mouse control state
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Mouse events
renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

renderer.domElement.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    const rotateSpeed = 0.005;
    const moveSpeed = 0.01;

    // Horizontal drag → orbit left/right (theta)
    theta -= deltaX * rotateSpeed;

    // Vertical drag → move camera up/down linearly
    let newY = camera.position.y - deltaY * moveSpeed;
    newY = Math.max(verticalLimit.min, Math.min(verticalLimit.max, newY));
    camera.position.y = newY;

    previousMousePosition = { x: e.clientX, y: e.clientY };
});

// Disable zooming
renderer.domElement.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

// Animate and update camera
function animate() {
    requestAnimationFrame(animate);

    // Convert polar coords to Cartesian for orbital movement
    camera.position.x = radius * Math.sin(theta);
    camera.position.z = radius * Math.cos(theta);
    // camera
