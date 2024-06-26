import * as OBC from "openbim-components";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Decompress } from "./src";

export interface IGeometry {
    material: THREE.MeshLambertMaterial;
    geometries: THREE.BufferGeometry[];
}
export class MyCustomToolComponent
    extends OBC.Component<any>
    implements OBC.Disposable, OBC.Updateable {
    static readonly uuid = "bda2e0a7-d7bb-499f-a9a7-bdcf17a33678" as const;
    enabled = true;
    readonly onDisposed: OBC.Event<any> = new OBC.Event();
    readonly onAfterUpdate: OBC.Event<any> = new OBC.Event();
    readonly onBeforeUpdate: OBC.Event<any> = new OBC.Event();
    private uniqueGeometries: { [uuid: string]: THREE.BufferGeometry } = {};
    private uniqueMaterials: { [uuid: string]: THREE.MeshLambertMaterial } = {};
    /**
     *
     */
    constructor(components: OBC.Components) {
        super(components);
        this.components.tools.add(MyCustomToolComponent.uuid, this);
    }

    async update(_delta?: number | undefined) {
        if (this.enabled) {
            await this.onBeforeUpdate.trigger(this);
            TWEEN.update();
            await this.onAfterUpdate.trigger(this);
        }
    }
    async dispose() {
        await this.onDisposed.trigger(this);
        this.onDisposed.reset();
        console.log("MyCustomToolComponent disposed!");
    }
    get() {
        throw new Error("Method not implemented.");
    }

    action = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".gz";
        input.multiple = false;
        input.click();
        input.onchange = async (e: any) => {
            const file = e.target.files[0] as File;
            // const jsonFile = JSON.parse(await file.text());
            // this.catchJsonFile(jsonFile);
            await new Decompress(this.components.scene.get()).readFile(
                new Uint8Array(await file.arrayBuffer())
            );
        };
        input.remove();
    };
    private catchJsonFile(jsonFile: any) {
        console.log(jsonFile);
        const { geometries, materials, object, textures, images } = jsonFile;
        if (!geometries || !materials || !object || !textures || !images)
            throw new Error("Missing input requirement!");
        if (!object.children || !Array.isArray(object.children))
            throw new Error("Missing children in object");
        // storage geometries
        this.storageGeometries(geometries);
        this.storageMaterials(materials);
        this.storageObject(object.children);
    }
    private storageGeometries(geometries: any[]) {
        for (const geo of geometries) {
            const { uuid, data } = geo;
            if (!uuid || !data) continue;
            if (!data.attributes) continue;
            const { position, uv } = data.attributes;
            // check if position or uv
            if (!position || !uv) continue;
            // check array
            if (!position.array || !uv.array) continue;
            if (!position.itemSize || !uv.itemSize) continue;
            if (!Array.isArray(position.array) || !Array.isArray(uv.array)) continue;
            if (position.array.length === 0 || uv.array.length === 0) continue;
            const newPosition = new Float32Array(position.array);
            const newPUv = new Float32Array(uv.array);
            const geometry = new THREE.BufferGeometry();
            const index: number[] = [];
            for (let i = 0; i < position.array.length / 3; i++) {
                index.push(i);
            }
            geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(newPosition, position.itemSize)
            );
            geometry.setAttribute(
                "uv",
                new THREE.BufferAttribute(newPUv, uv.itemSize)
            );
            geometry.setIndex(index);
            geometry.computeVertexNormals();
            if (!this.uniqueGeometries[uuid]) this.uniqueGeometries[uuid] = geometry;
        }
    }
    private storageMaterials(materials: any[]) {
        for (const mat of materials) {
            const { color, transparent, opacity, uuid } = mat;
            if (!color || !opacity || !uuid) continue;
            if (typeof color !== "string" || typeof opacity !== "number") continue;
            const material = new THREE.MeshLambertMaterial({
                color: parseInt(color, 16),
                opacity,
                transparent,
            });
            if (!this.uniqueMaterials[uuid]) this.uniqueMaterials[uuid] = material;
        }
    }
    private storageObject(parentChildren: any[]) {
        const scene = this.components.scene.get();
        const geometryByMaterial: { [uuid: string]: IGeometry } = {};
        for (const child of parentChildren) {
            const { children, userData } = child;
            if (!children || !userData) continue;
            if (!Array.isArray(children)) continue;
            for (const child of children) {
                const { geometry, material } = child;
                if (!geometry || !material) continue;
                if (typeof geometry !== "string" || typeof material !== "string")
                    continue;
                const storageGeometry = this.uniqueGeometries[geometry];
                const storageMaterial = this.uniqueMaterials[material];
                if (!storageGeometry || !storageMaterial) continue;
                if (!geometryByMaterial[material])
                    geometryByMaterial[material] = {
                        material: storageMaterial,
                        geometries: [],
                    } as IGeometry;
                geometryByMaterial[material].geometries.push(storageGeometry);
            }
        }
        if (Object.keys(geometryByMaterial).length === 0)
            throw new Error("Something is wrong");
        const newMaterials: THREE.MeshLambertMaterial[] = [];
        const newGeometries: THREE.BufferGeometry[] = [];
        for (const uuid in geometryByMaterial) {
            const { material, geometries } = geometryByMaterial[uuid];
            if (geometries.length === 0) continue;
            const merged = mergeGeometries(geometries);
            if (!merged) throw new Error("Can not merge geometry");
            newGeometries.push(merged);
            geometries.forEach((geo: THREE.BufferGeometry) => geo.dispose());
            newMaterials.push(material);
        }
        if (newGeometries.length === 0) throw new Error("Something is wrong");
        const combine = mergeGeometries(newGeometries, true);
        if (!combine) throw new Error("Can not merge geometry");
        combine.computeBoundingBox();
        const mesh = new THREE.Mesh(combine, newMaterials);
        scene.add(mesh);
        newGeometries.forEach((geo: THREE.BufferGeometry) => geo.dispose());
        this.uniqueGeometries = {};
        this.uniqueMaterials = {};
    }
}
OBC.ToolComponent.libraryUUIDs.add(MyCustomToolComponent.uuid);
