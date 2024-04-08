import * as OBC from "openbim-components";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js"


export class MyCustomToolComponent extends OBC.Component<any>
    implements OBC.Disposable, OBC.Updateable {
    static readonly uuid = "281d17dd-605e-4ab9-b6bc-e0e1e183d8da" as const;
    enabled = true;
    readonly onDisposed: OBC.Event<any> = new OBC.Event();
    readonly onAfterUpdate: OBC.Event<any> = new OBC.Event();
    readonly onBeforeUpdate: OBC.Event<any> = new OBC.Event();
    private mesh!: THREE.Mesh;

    constructor(component: OBC.Components) {
        super(component);
        this.components.tools.add(MyCustomToolComponent.uuid, this);
    }
    async update(delta?: number | undefined) {
        if (this.enabled) {
            await this.onBeforeUpdate.trigger(this);
            TWEEN.update();
            await this.onAfterUpdate.trigger(this);
        }
    }

    async dispose() {
        this.mesh?.geometry?.dispose();
        //@ts-ignore
        this.mesh?.material?.dispose();
        this.mesh?.removeFromParent();

        await this.onDisposed.trigger(this);
        this.onDisposed.reset();
        console.log("MyCustomToolComponent is disposed");
        //$
    }
    get(...args: any) {
        throw new Error("Method is not implemented.")
    }
    setUp() {
        const scene = this.components.scene.get();
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(5, 5, 5),
            new THREE.MeshLambertMaterial({ color: "green" })
        );
        scene.add(mesh);
    }
    action = () => { };
}

OBC.ToolComponent.libraryUUIDs.add(MyCustomToolComponent.uuid);