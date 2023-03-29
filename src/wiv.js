import { Color } from "three";
import {
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCDOOR,
  IFCWINDOW,
  IFCFURNISHINGELEMENT,
  IFCMEMBER,
  IFCPLATE,
} from "web-ifc";
import { IfcViewerAPI } from "web-ifc-viewer";

const wivContainer = document.getElementById("wiv");
const ifcViewer = new IfcViewerAPI({
  container: wivContainer,
  backgroundColor: new Color(0xf1f5f9),
});
ifcViewer.grid.setGrid();
ifcViewer.axes.setAxes();

const loadIfc = async (ifcURL) => {
  await ifcViewer.IFC.setWasmPath("./");
  const model = await ifcViewer.IFC.loadIfcUrl(ifcURL);
  await ifcViewer.shadowDropper.renderShadow(model.modelID);
};

const inputElement = document.getElementById("file-input");
const modelNameElement = document.getElementById("model-name");
ifcModelNumber = localStorage.getItem("ifc");
if (!(ifcModelNumber < 1 || ifcModelNumber > 5)) {
  inputElement.style.display = "none";
  const ifcURL = `../static/IFC/0${ifcModelNumber}.ifc`;
  const modelName = ifcURL.split("/").pop();
  modelNameElement.innerHTML = `Model: ${modelName}`;
  loadIfc(ifcURL);
} else {
  inputElement.addEventListener(
    "change",
    async (changed) => {
      const ifcURL = URL.createObjectURL(changed.target.files[0]);
      const modelName = ifcURL.split("/").pop();
      modelNameElement.innerHTML = `The model you uploaded`;
      loadIfc(ifcURL);
    },
    false
  );
}

window.onmousemove = async () => await ifcViewer.IFC.selector.prePickIfcItem();
window.ondblclick = async () => await ifcViewer.IFC.selector.pickIfcItem();

// const ifcCategories = {
//   IFCWALLSTANDARDCASE,
//   IFCSLAB,
//   IFCDOOR,
//   IFCWINDOW,
//   IFCFURNISHINGELEMENT,
//   IFCMEMBER,
//   IFCPLATE,
// };

// export const uploadIfcWiv = async (container, inputElement) => {

//   // Visibility exercise. It doesn't work, because:
//   // 1. Not everything is in the same file.
//   // 2. There is no IFC model in the viewer when the web page is first rendered.
//   //    How do I make
//   // await setupAllCategories(ifcViewer);

//   return ifcViewer;
// };

// const getName = (category) => {
//   const names = Object.keys(ifcCategories);
//   return names.find((name) => ifcCategories[name] === category);
// };

// const getAll = async (ifcViewer, category) => {
//   console.log(ifcViewer.IFC.loader.ifcManager);
//   console.log(category);
//   return ifcViewer.IFC.loader.ifcManager.getAllItemsOfType(0, category, false);
// };

// const newSubsetOfType = async (ifcViewer, category) => {
//   const scene = ifcViewer.context.getScene();
//   const ids = await getAll(ifcViewer, category);
//   return ifcViewer.IFC.loader.ifcManager.createSubset({
//     modelID: 0,
//     scene,
//     ids,
//     removePrevious: true,
//     customID: category.toString(),
//   });
// };

// const subsets = {};

// const setupCheckbox = async (ifcViewer, category) => {
//   const scene = ifcViewer.context.getScene();
//   const name = getName(category);
//   const checkbox = document.getElementById(name);
//   checkbox.addEventListener("change", (event) => {
//     const checked = event.target.checked;
//     const subset = subsets[category];
//     if (checked) scene.add(subset);
//     else subset.removeFromParent();
//   });
// };

// const setupCategory = async (ifcViewer, category) => {
//   subsets[category] = await newSubsetOfType(ifcViewer, category);
//   setupCheckbox(ifcViewer, category);
// };

// const setupAllCategories = async (ifcViewer) => {
//   const allCategories = Object.values(ifcCategories);
//   console.log(ifcCategories);
//   for (let i = 0; i < allCategories.length; i++) {
//     const category = allCategories[i];
//     await setupCategory(ifcViewer, category);
//   }
// };
