import { createThreeScene } from "./three-scene";
import { loadGltf } from "./gltf";
import { uploadIfcWit } from "./wit";

// Load a glTF in Three.js
const gltfCanvas = document.getElementById("gltf");
if (gltfCanvas) {
  const [renderer, scene, clock, cameraControls] = createThreeScene(gltfCanvas);
  const camera = scene.getObjectByName("camera");
  cameraControls.setLookAt(15, 15, 15, 0, 10, 0);

  gltfUrl = "../static/glTF/police_station.glb";
  loaderContainer = document.getElementById("loader-container");
  loadGltf(gltfUrl, scene, loaderContainer);

  function animate() {
    const delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

// Upload a glTF to a Three.js scene
const gltfUploadCanvas = document.getElementById("upload-gltf");
if (gltfUploadCanvas) {
  const gltfUrl = "";
  const loaderContainer = document.getElementById("loader-container");
  if (!gltfUrl) {
  }
}

// Upload an IFC file and visualize it with web-ifc-three (WIT)
const witCanvas = document.getElementById("wit");
if (witCanvas) {
  const [renderer, scene, clock, cameraControls] = createThreeScene(witCanvas);
  const camera = scene.getObjectByName("camera");

  const input = document.getElementById("file-input");
  uploadIfcWit(input, scene);

  function animate() {
    const delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}
