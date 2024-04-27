
import * as OBC from "openbim-components";
import *  as THREE from "three";


export interface IGEOMETRY {
    material: THREE.MeshLambertMaterial;
    geometries: THREE.BufferGeometry[];
}

export class WorkerComponent extends OBC.Component<any> implements OBC.Disposable {
    static readonly uuid = "" as const;
    enabled = false;
    static readonly _uuid = "28e87e9c-7d1e-44c5-84de-8cd3990f847e" as const;
    readonly onDisposed: OBC.Event<any> = new OBC.Event();
    private worker1: Worker = new Worker(new URL("./worker1.js", import.meta.url));
    private worker2: Worker = new Worker(new URL("./worker2.js", import.meta.url));
    get() {
        throw new Error("Method is not implemented!")
    }


    constructor(components: OBC.Components) {
        super(components);
        this.components.tools.add(WorkerComponent._uuid, this);
        this.init();
    }

    async dispose() {
        await this.onDisposed.trigger(this);
        this.onDisposed.reset();
        console.log("WorkerComponent disposed");
    }
    private init() {
        const map: Map<string, string> = new Map();
        const data = { action: "init", payload: map }
        this.worker1.postMessage(data)
        this.worker1.onmessage = async (e: MessageEvent) => {
            console.log(e.data)
        }

        this.worker2.postMessage(data)
        this.worker2.onmessage = async (e: MessageEvent) => {
            console.log(e.data)
        }
    }
}
OBC.ToolComponent.libraryUUIDs.add(WorkerComponent.uuid);