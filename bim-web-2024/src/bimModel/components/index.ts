import * as OBC from "openbim-components";
import * as THREE from "three";
import Stats from "stats.js";
import { MyCustomToolComponent, WorkerComponent } from "./src";


export class BasicComponent implements OBC.Disposable {
    readonly onDisposed: OBC.Event<any> = new OBC.Event();
    private components!: OBC.Components;

    constructor(private container: HTMLDivElement) {
        this.init();
        this.accessGrid();
    }
    async dispose() {
        this.components?.dispose();
        await this.onDisposed.trigger(this);
        this.onDisposed.reset();
        console.log("Basic Component Disposed!")

    }
    private init() {
        this.components = new OBC.Components();
        this.components.scene = new OBC.SimpleScene(this.components);
        this.components.renderer = new OBC.PostproductionRenderer(this.components, this.container);
        this.components.camera = new OBC.SimpleCamera(this.components);
        this.components.raycaster = new OBC.SimpleRaycaster(this.components);

        this.components.init();

        const scene = this.components.scene.get();
        (this.components.renderer as OBC.PostproductionRenderer).postproduction.enabled = true;

        (this.components.camera as OBC.SimpleCamera).controls.setLookAt(20, 20, 20, 0, 0, 0);
        const directionalLight = new THREE.DirectionalLight();
        directionalLight.position.set(5, 10, 3);
        directionalLight.intensity = 0.5;
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight();
        ambientLight.intensity = 0.5;
        scene.add(ambientLight);
        const grid = new OBC.SimpleGrid(this.components, new THREE.Color(0x666666));
        this.components.tools.add("77e3066d-c402-4d77-b3bf-3f1dce9a9576", grid);

        const customEffects = (this.components.renderer as OBC.PostproductionRenderer).postproduction.customEffects;
        customEffects.excludedMeshes.push(grid.get());

        const matrix = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);
        const matrixInverse = matrix.clone().transpose();
        scene.matrix.premultiply(matrix).multiply(matrixInverse);
    }

    private accessGrid() {
        const myTool = new MyCustomToolComponent(this.components);
        myTool.enabled = true;
        const worker = this.components.tools.get(WorkerComponent);
        worker.enabled = true;

        const toolbar = new OBC.Toolbar(this.components);
        // load model btn
        const loadButton = new OBC.Button(this.components);
        loadButton.materialIcon = "upload";
        loadButton.tooltip = "Load model";
        // change color element
        const changeColor = new OBC.Button(this.components);
        changeColor.materialIcon = "account_tree";
        loadButton.onClick.add(worker.loadFile);
        this.components.ui.addToolbar(toolbar);
        toolbar.addChild(loadButton);

        const stats = new Stats();
        stats.showPanel(0);
        document.body.append(stats.dom);
        stats.dom.style.left = "0px";
        const renderer = this.components.renderer as OBC.PostproductionRenderer;
        renderer.onBeforeUpdate.add(() => stats.begin());
        renderer.onAfterUpdate.add(() => stats.end());

    }


}