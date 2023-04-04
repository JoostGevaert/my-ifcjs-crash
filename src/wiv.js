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
  model.removeFromParent();
  await ifcViewer.shadowDropper.renderShadow(model.modelID);

  // *4 Toggle visibility by IFC category
  await setupAllIfcCategories();
};

// 2 Load IFC model into viewer
const modelNameElement = document.getElementById("model-name");
ifcModelNumber = localStorage.getItem("ifc");
if (!(ifcModelNumber < 1 || ifcModelNumber > 5)) {
  document.getElementById("file-input-label").style.display = "none";
  const ifcURL = `./public/IFC/0${ifcModelNumber}.ifc`;
  const modelName = ifcURL.split("/").pop();
  modelNameElement.innerHTML = `Model: ${modelName}`;
  loadIfc(ifcURL);
} else {
  document.getElementById("file-input").addEventListener(
    "change",
    async (changed) => {
      const ifcURL = URL.createObjectURL(changed.target.files[0]);
      const modelName = ifcURL.split("/").pop();
      modelNameElement.innerHTML = "The model you uploaded";
      loadIfc(ifcURL);
    },
    false
  );
}

// 3 Make IFC elements selectable
// ¿How to deselect elements?
window.onmousemove = async () => await ifcViewer.IFC.selector.prePickIfcItem();
window.ondblclick = async () => await ifcViewer.IFC.selector.pickIfcItem();

// 4 Toggle visibility by IFC category
// ifcCategories contains {IFCNAME: ####},
// where #### is the IFC number associated with the name of that IFC category
const ifcCategories = {
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCFURNISHINGELEMENT,
  IFCDOOR,
  IFCWINDOW,
  IFCPLATE,
  IFCMEMBER,
};

const scene = ifcViewer.context.getScene();

const subsets = {};

// Gets the name of a category
const getIfcCategoryName = (ifcCategoryId) => {
  const ifcNames = Object.keys(ifcCategories);
  return ifcNames.find((name) => ifcCategories[name] === ifcCategoryId);
};

// Gets all the items of a category
const getAllIfcElementsOfIfcCategoryId = async (ifcCategoryId) =>
  ifcViewer.IFC.loader.ifcManager.getAllItemsOfType(0, ifcCategoryId, false);

// Creates a new subset containing all elements of a category
const newSubsetOfType = async (ifcCategoryId) => {
  const ids = await getAllIfcElementsOfIfcCategoryId(ifcCategoryId);
  return ifcViewer.IFC.loader.ifcManager.createSubset({
    modelID: 0,
    scene,
    ids,
    removePrevious: true,
    customID: ifcCategoryId.toString(),
  });
};

// Creates a new subset and configures the checkbox
const setupIfcCategory = async (ifcCategoryId) => {
  subsets[ifcCategoryId] = await newSubsetOfType(ifcCategoryId);
  setupCheckBox(ifcCategoryId);
};

// Sets up the checkbox event to hide / show elements
const setupCheckBox = (ifcCategoryId) => {
  const ifcCategoryName = getIfcCategoryName(ifcCategoryId);
  const checkBox = document.getElementById(ifcCategoryName);
  checkBox.addEventListener("change", (event) => {
    const { checked } = event.target;
    const subset = subsets[ifcCategoryId];
    if (checked) scene.add(subset);
    else subset.removeFromParent();
  });
};

// Stores the created subsets
const setupAllIfcCategories = async () => {
  const allCategories = Object.values(ifcCategories);
  for (let i = 0; i < allCategories.length; i++) {
    const category = allCategories[i];
    await setupIfcCategory(category);
  }
};
