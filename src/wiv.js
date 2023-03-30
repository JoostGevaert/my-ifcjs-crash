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

// 1 Instantiate IFC viewer (WIV: web-ifc-viewer)
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

// 2 Load IFC model into viewer
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

// Make IFC elements selectable
// ¿How to deselect elements?
window.onmousemove = async () => await ifcViewer.IFC.selector.prePickIfcItem();
window.ondblclick = async () => await ifcViewer.IFC.selector.pickIfcItem();

// 3 Toggle visibility by IFC category
const ifcCategories = {
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCDOOR,
  IFCWINDOW,
  IFCFURNISHINGELEMENT,
  IFCMEMBER,
  IFCPLATE,
};

const subsets = {};

const scene = ifcViewer.context.getScene();

const getName = (category) => {
  const names = Object.keys(ifcCategories);
  return names.find((name) => ifcCategories[name] === category);
};

const getAll = async (category) => {
  return ifcViewer.IFC.loader.ifcManager.getAllItemsOfType(0, category, false);
};

const newSubsetOfType = async (category) => {
  const ids = await getAll(category);
  return ifcViewer.IFC.loader.ifcManager.createSubset({
    modelID: 0,
    scene,
    ids,
    removePrevious: true,
    customID: category.toString(),
  });
};


const setupCheckbox = async (category) => {
  const scene = ifcViewer.context.getScene();
  const name = getName(category);
  const checkbox = document.getElementById(name);
  checkbox.addEventListener("change", (event) => {
    const checked = event.target.checked;
    const subset = subsets[category];
    console.log(`Checkbox of IFC category ${name} changed to ${checked}`);
    if (checked) scene.add(subset);
    else subset.removeFromParent();
  });
};

const setupCategory = async (category) => {
  subsets[category] = await newSubsetOfType(category);
  setupCheckbox(category);
};

const setupAllCategories = async () => {
  const allCategories = Object.values(ifcCategories);
  console.log(ifcCategories);
  for (let i = 0; i < allCategories.length; i++) {
    const category = allCategories[i];
    await setupCategory(category);
  }
};

