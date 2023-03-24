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

const ifcCategories = {
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCDOOR,
  IFCWINDOW,
  IFCFURNISHINGELEMENT,
  IFCMEMBER,
  IFCPLATE,
};

export const loadIfc = async (container, ifcModelNumber) => {
  if (ifcModelNumber < 1 || ifcModelNumber > 5) {
    return;
  } else {
    const url = `../static/IFC/0${ifcModelNumber}.ifc`;
    const ifcViewer = new IfcViewerAPI({
      container,
      backgroundColor: new Color(0xffffff),
    });
    ifcViewer.grid.setGrid();
    ifcViewer.axes.setAxes();

    await ifcViewer.IFC.setWasmPath("./");
    const model = await ifcViewer.IFC.loadIfcUrl(url);
    await ifcViewer.shadowDropper.renderShadow(model.modelID);

    return ifcViewer;
  }
};

export const uploadIfcWiv = async (container, inputElement) => {
  const ifcViewer = new IfcViewerAPI({
    container,
    backgroundColor: new Color(0xffffff),
  });
  ifcViewer.grid.setGrid();
  ifcViewer.axes.setAxes();

  inputElement.addEventListener(
    "change",
    async (changed) => {
      const ifcURL = URL.createObjectURL(changed.target.files[0]);
      await ifcViewer.IFC.setWasmPath("./");
      const ifcModel = await ifcViewer.IFC.loadIfcUrl(ifcURL);
      await ifcViewer.shadowDropper.renderShadow(ifcModel.modelID);
    },
    false
  );

  window.ondblclick = async () => await ifcViewer.IFC.selector.pickIfcItem();
  window.onmousemove = async () =>
    await ifcViewer.IFC.selector.prePickIfcItem();

  // Visibility exercise. It doesn't work, because:
  // 1. Not everything is in the same file.
  // 2. There is no IFC model in the viewer when the web page is first rendered.
  //    How do I make 
  // await setupAllCategories(ifcViewer);

  return ifcViewer;
};

const getName = (category) => {
  const names = Object.keys(ifcCategories);
  return names.find((name) => ifcCategories[name] === category);
};

const getAll = async (ifcViewer, category) => {
  console.log(ifcViewer.IFC.loader.ifcManager);
  console.log(category);
  return ifcViewer.IFC.loader.ifcManager.getAllItemsOfType(0, category, false);
};

const newSubsetOfType = async (ifcViewer, category) => {
  const scene = ifcViewer.context.getScene();
  const ids = await getAll(ifcViewer, category);
  return ifcViewer.IFC.loader.ifcManager.createSubset({
    modelID: 0,
    scene,
    ids,
    removePrevious: true,
    customID: category.toString(),
  });
};

const subsets = {};

const setupCheckbox = async (ifcViewer, category) => {
  const scene = ifcViewer.context.getScene();
  const name = getName(category);
  const checkbox = document.getElementById(name);
  checkbox.addEventListener("change", (event) => {
    const checked = event.target.checked;
    const subset = subsets[category];
    if (checked) scene.add(subset);
    else subset.removeFromParent();
  });
};

const setupCategory = async (ifcViewer, category) => {
  subsets[category] = await newSubsetOfType(ifcViewer, category);
  setupCheckbox(ifcViewer, category);
};

const setupAllCategories = async (ifcViewer) => {
  const allCategories = Object.values(ifcCategories);
  console.log(ifcCategories);
  for (let i = 0; i < allCategories.length; i++) {
    const category = allCategories[i];
    await setupCategory(ifcViewer, category);
  }
};
