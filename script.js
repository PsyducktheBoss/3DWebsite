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

camera.position.set(0, 0, 5);

// Custom camera controls
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
const verticalLimit = 2; // Max up/down movement

renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

renderer.domElement.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
    };

    // Horizontal movement → rotate camera around Y axis
    const rotationSpeed = 0.005;
    const deltaRotation = deltaMove.x * rotationSpeed;
    camera.rotation.y -= deltaRotation;

    // Vertical movement → move camera up/down within limit
    const moveSpeed = 0.01;
    let newY = camera.position.y - deltaMove.y * moveSpeed;
    newY = Math.max(-verticalLimit, Math.min(verticalLimit, newY));
    camera.position.y = newY;

    previousMousePosition = { x: e.clientX, y: e.clientY };
});

// Disable scroll wheel zoom
renderer.domElement.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

// Animate
function animate() {
    requestAnimationFrame(animate);
    if (SpinningCube) {
        SpinningCube.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
}
animate();
