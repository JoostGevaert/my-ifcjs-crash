import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils,
  MOUSE,
  Clock,
  DirectionalLight,
  AmbientLight,
  AxesHelper,
  GridHelper,
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
} from "three";
import CameraControls from "camera-controls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const subsetOfTHREE = {
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils: {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp,
  },
};

const canvas = document.getElementById("gltf-canvas");

// 1 Scene
const scene = new Scene();
const grid = new GridHelper();
grid.renderOrder = 1;
const axes = new AxesHelper();
axes.renderOrder = 2;
scene.add(grid, axes);

// 2 Add objects to scene
// N.A.

// 3 Camera
const camera = new PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight
);
camera.position.x = 4;
camera.position.y = 6;
camera.position.z = 10;
scene.add(camera);

// 4 Renderer
const renderer = new WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
renderer.setClearAlpha(0);

// 5 Lights
const ambientLight = new AmbientLight(0xffffff, 0.2);
const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(-1, 1, 1).normalize();
scene.add(ambientLight, directionalLight);

// 6 Controls
CameraControls.install({ THREE: subsetOfTHREE });
const clock = new Clock();
const cameraControls = new CameraControls(camera, canvas);

// 7 Responsive to resize viewer
window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

// 8 Animate camera controls
function animate() {
  const delta = clock.getDelta();
  cameraControls.update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// 9 Load glTF
const loadGltf = (gltfURL) => {
  const loader = new GLTFLoader();
  loader.load(
    gltfURL,
    (gltf) => {
      loaderContainer.style.display = "none";
      scene.add(gltf.scene);
    },
    (progress) => {
      const current = Math.floor((progress.loaded / progress.total) * 100);
      loaderContainer.querySelector("p").textContent = `Loading: ${current}%`;
    },
    (error) => {
      console.log(`An error occurred ${error}`);
    }
  );
};

loaderContainer = document.getElementById("loader-container");
const gltfFile = localStorage.getItem("glTF");
if (gltfFile.length > 1) {
  document.getElementById("file-input-label").style.display = "none";
  const gltfURL = `./public/glTF/${gltfFile}`;
  loadGltf(gltfURL);
} else {
  loaderContainer.style.display = "none";
  document.getElementById("file-input").addEventListener(
    "change",
    async (changed) => {
      loaderContainer.style.display = "flex";
      const gltfURL = URL.createObjectURL(changed.target.files[0]);
      loadGltf(gltfURL);
    },
    false
  );
}
