import * as THREE from "three";
export class InstanceMesh {
    private readonly total = 100;
    constructor(private scene: THREE.Scene) {
        this.initBasicInstanceMesh();
    }
    async dispose() {

    }
    private initBasicInstanceMesh() {
        const a = 2
        const geometry = new THREE.BoxGeometry(a, a, a);
        const material = new THREE.MeshLambertMaterial()
        const instanceMesh = new THREE.InstancedMesh(
            geometry,
            material,
            this.total * this.total
        )
        this.scene.add(instanceMesh);
        for (let i = 0; i < this.total; i++) {
            for (let j = 0; j < this.total; j++) {
                const matrix = new THREE.Matrix4();
                matrix.makeTranslation(i * 2 * a, 0, j * 2 * a);
                instanceMesh.setMatrixAt(i * this.total + j, matrix);
            }
        }
        instanceMesh.instanceMatrix.needsUpdate = true;

        for (let i = 0; i < this.total; i++) {
            for (let j = 0; j < this.total; j++) {
                const color = new THREE.Color(
                    "#" + Math.floor(Math.random() * 16777215).toString(16)
                );
                instanceMesh.setColorAt(i * this.total + j, color);
                instanceMesh.instanceColor!.needsUpdate = true;
            }
        }

        console.log(instanceMesh)

    }
}