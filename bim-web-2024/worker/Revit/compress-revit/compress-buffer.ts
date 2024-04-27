// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import * as flatbuffers from 'flatbuffers';

import { IElementBuffer } from '../compress-revit/ielement-buffer.js';
import { IGeometryBuffer } from '../compress-revit/igeometry-buffer.js';
import { IMaterialBuffer } from '../compress-revit/imaterial-buffer.js';
import { IMetadataBuffer } from '../compress-revit/imetadata-buffer.js';


export class CompressBuffer {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):CompressBuffer {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsCompressBuffer(bb:flatbuffers.ByteBuffer, obj?:CompressBuffer):CompressBuffer {
  return (obj || new CompressBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsCompressBuffer(bb:flatbuffers.ByteBuffer, obj?:CompressBuffer):CompressBuffer {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new CompressBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

geometries(index: number, obj?:IGeometryBuffer):IGeometryBuffer|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? (obj || new IGeometryBuffer()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

geometriesLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

materials(index: number, obj?:IMaterialBuffer):IMaterialBuffer|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new IMaterialBuffer()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

materialsLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

metadata(obj?:IMetadataBuffer):IMetadataBuffer|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? (obj || new IMetadataBuffer()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

children(index: number, obj?:IElementBuffer):IElementBuffer|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? (obj || new IElementBuffer()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

childrenLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startCompressBuffer(builder:flatbuffers.Builder) {
  builder.startObject(4);
}

static addGeometries(builder:flatbuffers.Builder, geometriesOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, geometriesOffset, 0);
}

static createGeometriesVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startGeometriesVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addMaterials(builder:flatbuffers.Builder, materialsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, materialsOffset, 0);
}

static createMaterialsVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startMaterialsVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addMetadata(builder:flatbuffers.Builder, metadataOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, metadataOffset, 0);
}

static addChildren(builder:flatbuffers.Builder, childrenOffset:flatbuffers.Offset) {
  builder.addFieldOffset(3, childrenOffset, 0);
}

static createChildrenVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startChildrenVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endCompressBuffer(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static finishCompressBufferBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
}

static finishSizePrefixedCompressBufferBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset, undefined, true);
}

}