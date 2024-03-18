import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import CameraControls from "camera-controls";
import * as OBC from "openbim-components";

export class ThreeJS implements OBC.Disposable {
    readonly onDisposed: OBC.Event<any> = new OBC.Event();

    private _scene: THREE.Scene = new THREE.Scene();
    private _perspectiveCamera!: THREE.PerspectiveCamera;
    private _orthographicCamera!: THREE.OrthographicCamera;
    private _renderer!: THREE.WebGLRenderer;
    private _labelRenderer!: THREE.CSS2DRenderer;
    private _controls!: CameraControls;
    public currentCamera!: THREE.PerspectiveCamera | THREE.OrthographicCamera;

    private _projection = true;
    set projection(projection: boolean) {
        if (projection === this._projection) return;

    }
    get projection(): boolean {
        return this._projection;
    }

    constructor(private container: HTMLDivElement) {
        this.initPerspectiveCamera();
    }


    async dispose() {
        await this.onDisposed.trigger();
        this.onDisposed.reset();
        console.log("ThreeJS was Disposed!")
    }

    private initPerspectiveCamera() {
        //45 : Fov
        //1: distance(camera, near) = 1m
        //1000: distance(camera, Far plane) = 1000m
        // width, height = rectangle of viewport
        //aspect: result of w&h of viewport
        const { width, height } = this.container.getBoundingClientRect();
        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        return camera;
    }
    private initOrthographicCamera() {
        const { width, height } = this.container.getBoundingClientRect();
        const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000)
        return camera;
    }
}