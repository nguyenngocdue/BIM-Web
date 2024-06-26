// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import * as flatbuffers from 'flatbuffers';

import { IPositionBuffer } from '../compress-revit/iposition-buffer.js';
import { IUVBuffer } from '../compress-revit/iuvbuffer.js';


export class IGeometryBuffer {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):IGeometryBuffer {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsIGeometryBuffer(bb:flatbuffers.ByteBuffer, obj?:IGeometryBuffer):IGeometryBuffer {
  return (obj || new IGeometryBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsIGeometryBuffer(bb:flatbuffers.ByteBuffer, obj?:IGeometryBuffer):IGeometryBuffer {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new IGeometryBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

uuui():string|null
uuui(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
uuui(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

position(obj?:IPositionBuffer):IPositionBuffer|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new IPositionBuffer()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

uv(obj?:IUVBuffer):IUVBuffer|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? (obj || new IUVBuffer()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

static startIGeometryBuffer(builder:flatbuffers.Builder) {
  builder.startObject(3);
}

static addUuui(builder:flatbuffers.Builder, uuuiOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, uuuiOffset, 0);
}

static addPosition(builder:flatbuffers.Builder, positionOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, positionOffset, 0);
}

static addUv(builder:flatbuffers.Builder, uvOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, uvOffset, 0);
}

static endIGeometryBuffer(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

}
