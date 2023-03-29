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

const canvas = document.getElementById("three-cubes");

// 1 Scene
const scene = new Scene();
const grid = new GridHelper();
grid.renderOrder = 1;
const axes = new AxesHelper();
axes.renderOrder = 2;
scene.add(grid, axes);

// 2 Add objects to scene
const createGeoWithEdges = (geometry, color, x) => {
  const material = new MeshPhongMaterial({
    color: color,
    specular: "white",
    shininess: 100,
    flatShading: true,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const mesh = new Mesh(geometry, material);
  const edgesGeo = new EdgesGeometry(mesh.geometry);
  const edgesMaterial = new LineBasicMaterial({ color: "black" });
  const edges = new LineSegments(edgesGeo, edgesMaterial);
  mesh.add(edges);
  mesh.position.x += x;
  return mesh;
};

const boxGeometry = new BoxGeometry(2, 2, 2);
const orangeCube = createGeoWithEdges(boxGeometry, "orange", 0);
const greenCube = createGeoWithEdges(boxGeometry, "green", 4);
const blueCube = createGeoWithEdges(boxGeometry, "blue", -4);
scene.add(orangeCube, greenCube, blueCube);

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
})

// 8 Animate cubes and camera controls
function animate() {
  orangeCube.rotation.x += 0.01;
  orangeCube.rotation.z += 0.01;

  greenCube.rotation.x += 0.015;
  greenCube.rotation.z += 0.015;

  blueCube.rotation.x += 0.005;
  blueCube.rotation.z += 0.005;

  const delta = clock.getDelta();
  cameraControls.update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
