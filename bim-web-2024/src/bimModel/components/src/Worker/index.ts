import * as OBC from "openbim-components";
import * as THREE from "three";
import {
    CompressBuffer,
    GeometryBuffer,
    IElementBuffer,
    MaterialBuffer,
} from "./RevitType";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export interface IGeometry {
    material: THREE.MeshLambertMaterial;
    geometries: THREE.BufferGeometry[];
}

export class WorkerComponent
    extends OBC.Component<any>
    implements OBC.Disposable {
    static readonly uuid = "c473430c-4518-45e7-8dd7-632bf6ea569d" as const;
    enabled = false;
    readonly onDisposed: OBC.Event<any> = new OBC.Event();
    private revitWorker: Worker = new Worker(
        new URL("./RevitWorker.js", import.meta.url)
    );
    private uniqueGeometries: { [uuid: string]: THREE.BufferGeometry } = {};
    private uniqueMaterials: { [uuid: string]: THREE.MeshLambertMaterial } = {};
    get() {
        throw new Error("Method not implemented.");
    }
    //
    /**
     *
     */
    constructor(components: OBC.Components) {
        super(components);
        this.components.tools.add(WorkerComponent.uuid, this);
        this.onMessage();
    }
    async dispose() {
        this.revitWorker.terminate();
        await this.onDisposed.trigger(this);
        this.onDisposed.reset();
        console.log("WorkerComponent disposed!");
    }
    private onMessage() {
        this.revitWorker.onmessage = async (e: MessageEvent) => {
            const { error, result } = e.data;
            if (error) {
                console.log(error);
                return;
            }
            const { geometries, materials, metadata, children } =
                result as CompressBuffer;
            this.storageGeometries(geometries);
            this.storageMaterials(materials);
            this.storageObject(children);
        };
    }
    loadFile = async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".gz";
        input.multiple = false;
        input.click();
        input.onchange = async (e: any) => {
            const file = e.target.files[0] as File;
            const rawBuffer = await file.arrayBuffer();
            this.revitWorker.postMessage({
                action: "onLoad",
                payload: new Uint8Array(rawBuffer),
            });
        };
        input.remove();
    };
    private storageGeometries(geometries: GeometryBuffer) {
        for (const geo in geometries) {
            const { uuid, position, uv } = geometries[geo];
            if (!uuid || !position || !uv) continue;
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
    private storageMaterials(materials: MaterialBuffer) {
        for (const mat in materials) {
            const { color, transparency, opacity, uuid } = materials[mat];
            if (!color || !opacity || !uuid) continue;
            if (typeof color !== "string" || typeof opacity !== "number") continue;
            const material = new THREE.MeshLambertMaterial({
                color: parseInt(color, 16),
                opacity,
                transparent: transparency,
            });
            if (!this.uniqueMaterials[uuid]) this.uniqueMaterials[uuid] = material;
        }
    }
    private storageObject(parentChildren: IElementBuffer[]) {
        const scene = this.components.scene.get();
        const geometryByMaterial: { [uuid: string]: IGeometry } = {};
        for (const child of parentChildren) {
            const { subChildren, userData } = child;
            if (!subChildren || !userData) continue;
            if (subChildren.length === 0) continue;
            for (const child of subChildren) {
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
OBC.ToolComponent.libraryUUIDs.add(WorkerComponent.uuid);
