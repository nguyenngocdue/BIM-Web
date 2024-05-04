import * as flatbuffers from "flatbuffers";
import * as pako from "pako";
import * as FB from "./compress-revit";
import {
  CompressBuffer,
  GeometryBuffer,
  IElementBuffer,
  IGeometryBuffer,
  IMaterialBuffer,
  IPositionBuffer,
  ISubElementBuffer,
  IUVBuffer,
  MaterialBuffer,
} from "./RevitType";

export class Decompress {
  /**
   *
   */
  constructor(
    private onSuccess: (data: any) => void,
    private onError: (error: any) => void
  ) { }
  async readFile(buffer: Uint8Array) {
    try {
      const before = performance.now();
      const newBuffer = pako.inflate(buffer);
      console.log(newBuffer.length);


      const builder = new flatbuffers.ByteBuffer(newBuffer);
      const data = FB.CompressBuffer.getRootAsCompressBuffer(builder);
      const geometries = this.deCompressGeometries(data);
      if (!geometries) {
        this.onError("Can not Decompress Geometries");
        return;
      }
      const materials = this.deCompressMaterials(data);
      if (!materials) {
        this.onError("Can not Decompress Materials");
        return;
      }
      const metaString = data.metadata();
      const metadata = {
        version: metaString!.version()!,
        type: metaString!.type()!,
        generator: metaString!.generator()!,
        projectName: metaString!.projectName()!,
      };

      const children = this.deCompressChildren(data);
      if (children.length === 0) {
        this.onError("Can not Decompress Children");
        return;
      }
      this.onSuccess({
        geometries,
        materials,
        metadata,
        children,
      });
      console.log(`${performance.now() - before}`);
    } catch (error: any) {
      this.onError(error);
    }
  }
  private deCompressGeometries(data: FB.CompressBuffer): GeometryBuffer | null {
    const uniqueGeometries: GeometryBuffer = {};
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
      if (!uniqueGeometries[uuid])
        uniqueGeometries[uuid] = { uuid, position, uv } as IGeometryBuffer;
    }
    if (Object.keys(uniqueGeometries).length === 0) return null;
    return uniqueGeometries;
  }
  private deCompressPosition(
    position: FB.IPositionBuffer,
    index: number[]
  ): IPositionBuffer | null {
    const itemSize = position.itemSize();
    const array = position.arrayArray();
    if (!itemSize || !array || array.length === 0) return null;
    for (let i = 0; i < array.length; i++) {
      index.push(i);
    }
    return { itemSize, array };
  }
  private deCompressUv(position: FB.IUVBuffer): IUVBuffer | null {
    const itemSize = position.itemSize();
    const array = position.arrayArray();
    if (!itemSize || !array || array.length === 0) return null;
    return { itemSize, array };
  }
  private deCompressMaterials(data: FB.CompressBuffer): MaterialBuffer | null {
    const uniqueMaterials: MaterialBuffer = {};
    for (let i = 0; i < data.materialsLength(); i++) {
      const material = data.materials(i);
      if (!material) continue;
      const uuid = material.uuui();
      const color = material.color();
      if (!uuid || !color) continue;
      const transparency = material.transparentcy();
      const opacity = material.opacity();
      if (typeof color !== "string" || typeof opacity !== "number") continue;
      const newMaterial = {
        color,
        transparency,
        opacity,
        uuid,
      } as IMaterialBuffer;
      if (!uniqueMaterials[uuid]) uniqueMaterials[uuid] = newMaterial;
    }
    if (Object.keys(uniqueMaterials).length === 0) return null;
    return uniqueMaterials;
  }
  private deCompressChildren(data: FB.CompressBuffer): IElementBuffer[] {
    const children: IElementBuffer[] = [];
    for (let i = 0; i < data.childrenLength(); i++) {
      const child = data.children(i);
      if (!child) continue;
      const userData = child.userData();
      const subChildren = child.subChildrenLength();
      if (!userData || subChildren === 0) continue;
      const subs: ISubElementBuffer[] = [];
      for (let j = 0; j < subChildren; j++) {
        const subChild = child.subChildren(j);
        if (!subChild) continue;
        const geometry = subChild.geometry();
        const material = subChild.material();
        if (!geometry || !material) continue;
        subs.push({ geometry, material } as ISubElementBuffer);
      }
      children.push({ userData, subChildren: subs } as IElementBuffer);
    }
    return children;
  }
}
