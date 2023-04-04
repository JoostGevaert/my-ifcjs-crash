import { createThreeScene } from "./three-scene";
import { loadGltf } from "./gltf";
import { uploadIfcWit } from "./wit";

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
