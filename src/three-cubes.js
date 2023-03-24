import {
  Mesh,
  MeshPhongMaterial,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
} from "three"

export const createGeoWithEdges = (geometry, color, x) => {
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
