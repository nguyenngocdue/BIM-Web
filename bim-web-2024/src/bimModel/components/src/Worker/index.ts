
import * as OBC from "openbim-components";
import *  as THREE from "three";


export interface IGEOMETRY {
    material: THREE.MeshLambertMaterial;
    geometries: THREE.BufferGeometry[];
}

export class WorkerComponent extends OBC.Component<any> implements OBC.Disposable {
    static readonly uuid = "" as const;
    enabled = false;
    static readonly uuid = "fa483703-cc59-4a3d-85ba-2753ee60063f" as const;
    readonly onDisposed: OBC.Event<any> = new OBC.Event();
    private revitWorker: Worker = new Worker(new URL("./RevitWorker.js", import.meta.url));
    get() {
        throw new Error("Method is not implemented!")
    }
    private uniqueGeometries: { [uuid: string]: THREE.BufferGeometry } = {};
    private uniqueMaterials: { [uuid: string]: THREE.MeshLambertMaterial } = {};

    constructor(components: OBC.Components) {
        super(components);
        this.components.tools.add(WorkerComponent.uuid, this);
        this.onMessage();
    }

    private onMessage() {
        this.revitWorker.onmessage = async (e: MessageEvent) => {
            const { error, result } = e.data;
            if (error) {
                console.log(error);
                return;
            }
            // const { geometries, material, metadata, children } = result as CompressBuffer;
            // this.storageGeometries(geometries);
            // this.storageMaterials(materials);
            // this.storageObjects(children);
        }
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
                payload: new Uint8Array(rawBuffer)
            });
        }
        input.remove();
    };





    async dispose() {
        await this.onDisposed.trigger(this);
        this.onDisposed.reset();
        console.log("WorkerComponent disposed");
    }

}
OBC.ToolComponent.libraryUUIDs.add(WorkerComponent.uuid);