import * as flatbuffers from "flatbuffers";
import * as pako from "pako";
import * as FB from "./compress-revit";
import * as THREE from "three";
import { mergeBufferGeometries } from "three-stdlib";
import { IGeometry } from "..";

export interface IMetadata {
  type?: string;
  version?: number;
  generator?: string;
  projectName?: string;
}
export class Decompress {
  private uniqueGeometries: { [uuid: string]: THREE.BufferGeometry } = {};
  private uniqueMaterials: { [uuid: string]: THREE.MeshLambertMaterial } = {};
  private metadata!: IMetadata;
  /**
   *
   */
  constructor(private scene: THREE.Scene) { }
  async readFile(buffer: Uint8Array) {
    const before = performance.now();
    const newBuffer = pako.inflate(buffer);
    console.log(`${performance.now() - before}`);
    const builder = new flatbuffers.ByteBuffer(newBuffer);
    const data = FB.CompressBuffer.getRootAsCompressBuffer(builder);
    this.deCompressGeometries(data);
    this.deCompressMaterials(data);
    const metaString = data.metadata();
    this.metadata = {
      version: metaString!.version()!,
      type: metaString!.type()!,
      generator: metaString!.generator()!,
      projectName: metaString!.projectName()!,
    } as IMetadata;
    this.deCompressChildren(data);
  }
  private deCompressGeometries(data: FB.CompressBuffer) {
    for (let i = 0; i < data.geometriesLength(); i++) {
      const geometry = data.geometries(i);
      if (!geometry) continue;
      const uuid = geometry.uuui();
      const position0 = geometry.position();
      const uv0 = geometry.uv();
      if (!uuid || !position0 || !uv0) continue;
      const index: number[] = [];
      const position = this.deCompressPosition(position0, index);
      if (!position) continue;
      const uv = this.deCompressUv(uv0);
      if (!uv) continue;
      const deCompressGeometry = new THREE.BufferGeometry();
      deCompressGeometry.setAttribute("position", position);
      deCompressGeometry.setAttribute("uv", uv);
      deCompressGeometry.setIndex(index);
      deCompressGeometry.computeVertexNormals();
      if (!this.uniqueGeometries[uuid])
        this.uniqueGeometries[uuid] = deCompressGeometry;
    }
  }
  private deCompressPosition(
    position: FB.IPositionBuffer,
    index: number[]
  ): THREE.BufferAttribute | null {
    const itemSize = position.itemSize();
    const array = position.arrayArray();
    if (!itemSize || !array || array.length === 0) return null;
    for (let i = 0; i < array.length; i++) {
      index.push(i);
    }
    return new THREE.BufferAttribute(array, itemSize);
  }
  private deCompressUv(position: FB.IUVBuffer): THREE.BufferAttribute | null {
    const itemSize = position.itemSize();
    const array = position.arrayArray();
    if (!itemSize || !array || array.length === 0) return null;
    return new THREE.BufferAttribute(array, itemSize);
  }
  private deCompressMaterials(data: FB.CompressBuffer) {
    for (let i = 0; i < data.materialsLength(); i++) {
      const material = data.materials(i);
      if (!material) continue;
      const uuid = material.uuui();
      const color = material.color();
      if (!uuid || !color) continue;
      const transparent = material.transparentcy();
      const opacity = material.opacity();
      if (transparent) console.log(opacity);
      if (typeof color !== "string" || typeof opacity !== "number") continue;
      const newMaterial = new THREE.MeshLambertMaterial({
        color: parseInt(color, 16),
        opacity,
        transparent,
      });
      if (!this.uniqueMaterials[uuid]) this.uniqueMaterials[uuid] = newMaterial;
    }
  }
  private deCompressChildren(data: FB.CompressBuffer) {
    const geometryByMaterial: { [uuid: string]: IGeometry } = {};
    for (let i = 0; i < data.childrenLength(); i++) {
      const child = data.children(i);
      if (!child) continue;
      const userDataString = child.userData();
      const subChildren = child.subChildrenLength();
      if (!userDataString || subChildren === 0) continue;
      for (let j = 0; j < subChildren; j++) {
        const subChild = child.subChildren(j);
        if (!subChild) continue;
        const geometryId = subChild.geometry();
        const materialId = subChild.material();
        if (!geometryId || !materialId) continue;
        const storageGeometry = this.uniqueGeometries[geometryId];
        const storageMaterial = this.uniqueMaterials[materialId];
        if (!storageGeometry || !storageMaterial) continue;
        if (!geometryByMaterial[materialId])
          geometryByMaterial[materialId] = {
            material: storageMaterial,
            geometries: [],
          } as IGeometry;
        geometryByMaterial[materialId].geometries.push(storageGeometry);
      }
    }

    if (Object.keys(geometryByMaterial).length === 0)
      throw new Error("Something is wrong");
    const newMaterials: THREE.MeshLambertMaterial[] = [];
    const newGeometries: THREE.BufferGeometry[] = [];
    for (const uuid in geometryByMaterial) {
      const { material, geometries } = geometryByMaterial[uuid];
      if (geometries.length === 0) continue;
      const merged = mergeBufferGeometries(geometries);
      if (!merged) throw new Error("Can not merge geometry");
      newGeometries.push(merged);
      geometries.forEach((geo: THREE.BufferGeometry) => geo.dispose());
      newMaterials.push(material);
    }
    if (newGeometries.length === 0) throw new Error("Something is wrong");
    const combine = mergeBufferGeometries(newGeometries, true);
    if (!combine) throw new Error("Can not merge geometry");
    combine.computeBoundingBox();
    const mesh = new THREE.Mesh(combine, newMaterials);
    mesh.userData.metadata = this.metadata;
    this.scene.add(mesh);
    newGeometries.forEach((geo: THREE.BufferGeometry) => geo.dispose());
    this.uniqueGeometries = {};
    this.uniqueMaterials = {};
  }
}
