import * as THREE from "three";
export function ObjectLoaderJson(jsonData: any) {
    const loader = new THREE.ObjectLoader();
    return loader.parse(jsonData)
}