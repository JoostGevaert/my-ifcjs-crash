import { createThreeScene } from "./three-scene";
import { loadIfc, uploadIfcWiv } from "./wiv";
import { loadGltf } from "./gltf";
import { uploadIfcWit as uploadIfcWit } from "./wit";

// Visualize several different IFC models read from the repo
let ifcModelNumber = 0;
const ifcViewerContainer = document.getElementById("ifc-viewer");
if (ifcViewerContainer) {
  ifcModelNumber = localStorage.getItem("ifc");
  const ifcViewer = loadIfc(ifcViewerContainer, ifcModelNumber);
}

// Upload an IFC file and visualize it with web-ifc-viewer (WIV)
const wivContainer = document.getElementById("wiv");
if (wivContainer) {
  const input = document.getElementById("file-input");
  const ifcViewer = uploadIfcWiv(wivContainer, input);
}

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
