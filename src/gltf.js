import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const loadGltf = (gltfUrl, scene, loaderContainer) => {
  const loader = new GLTFLoader();

  loader.load(
    gltfUrl,
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
