import * as THREE from "three";
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

interface IGeometryMaterial {
    [colID: string]: {
        material: THREE.MeshLambertMaterial;
        buffers: THREE.BufferGeometry[];
    };
}
export class InstanceMesh {
    private readonly total = 10;
    constructor(private scene: THREE.Scene) {
        // this.initBasicInstanceMesh();
        this.initOneMeshOneModel();
    }
    async dispose() {

    }
    // private initBasicInstanceMesh() {
    //     const a = 2
    //     const geometry = new THREE.BoxGeometry(a, a, a);
    //     const material = new THREE.MeshLambertMaterial()
    //     const instanceMesh = new THREE.InstancedMesh(
    //         geometry,
    //         material,
    //         this.total * this.total
    //     )
    //     this.scene.add(instanceMesh);
    //     for (let i = 0; i < this.total; i++) {
    //         for (let j = 0; j < this.total; j++) {
    //             const matrix = new THREE.Matrix4();
    //             matrix.makeTranslation(i * 2 * a, 0, j * 2 * a);
    //             instanceMesh.setMatrixAt(i * this.total + j, matrix);
    //         }
    //     }
    //     instanceMesh.instanceMatrix.needsUpdate = true;

    //     for (let i = 0; i < this.total; i++) {
    //         for (let j = 0; j < this.total; j++) {
    //             const color = new THREE.Color(
    //                 "#" + Math.floor(Math.random() * 16777215).toString(16)
    //             );
    //             instanceMesh.setColorAt(i * this.total + j, color);
    //             instanceMesh.instanceColor!.needsUpdate = true;
    //         }
    //     }
    //     console.log(instanceMesh)
    // }

    private initOneMeshOneModel() {
        const a = 2;
        const geometry0 = new THREE.BoxGeometry(a, a, a);
        const geometryMaterials: IGeometryMaterial = {};
        for (let i = 0; i < this.total; i++) {
            const colID = "#" + Math.floor(Math.random() * 16777215).toString(16);
            const color = new THREE.Color(colID);
            const material = new THREE.MeshLambertMaterial({ color });
            if (!geometryMaterials[colID]) {
                geometryMaterials[colID] = { material, buffers: [] };
                for (let j = 0; j < this.total; j++) {
                    const matrix = new THREE.Matrix4();
                    matrix.makeTranslation(i * 2 * a, 0, j * 2 * a);
                    const geometry = geometry0.clone().applyMatrix4(matrix);
                    geometryMaterials[colID].buffers.push(geometry);
                }
            }
        }
        geometry0.dispose();
        const geometries: THREE.BufferGeometry[] = [];
        const materials: THREE.MeshLambertMaterial[] = [];
        for (const colId in geometryMaterials) {
            const { material, buffers } = geometryMaterials[colId];
            if (buffers.length === 0) continue;
            const combine = mergeGeometries(buffers);
            if (!combine) continue;
            geometries.push(combine);
            materials.push(material);
            buffers.forEach((buf: THREE.BufferGeometry) => buf.dispose());
        }
        const combine = mergeGeometries(geometries, true);
        geometries.forEach((buf: THREE.BufferGeometry) => buf.dispose());
        const mesh = new THREE.Mesh(combine, materials);
        // console.log(geometries)
        this.scene.add(mesh);
    }
}