export interface IPositionBuffer {
    itemSize: number;
    array: Float32Array;
}
export interface IUVBuffer {
    itemSize: number;
    array: Float32Array;
}
export interface IGeometryBuffer {
    uuid: string;
    position: IPositionBuffer;
    uv: IUVBuffer;
}
export interface GeometryBuffer {
    [uuid: string]: IGeometryBuffer;
}
export interface IMaterialBuffer {
    uuid: string;
    color: string;
    transparency: boolean;
    opacity: number;
}
export interface MaterialBuffer {
    [uuid: string]: IMaterialBuffer;
}
// metadata
export interface IMetadataBuffer {
    type?: string;
    version?: number;
    generator?: string;
    projectName?: string;
}
// element
export interface ISubElementBuffer {
    geometry: string;
    material: string;
}
export interface IElementBuffer {
    userData: string;
    subChildren: ISubElementBuffer[];
}

export interface CompressBuffer {
    geometries: GeometryBuffer;
    materials: MaterialBuffer;
    metadata: any;
    children: IElementBuffer[];
}
