import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import CameraControls from "camera-controls";
import * as OBC from "openbim-components";

const near = 1, far = 1000;
const pos0 = new THREE.Vector3(60, 60, 60);
CameraControls.install({
    THREE: {
        MOUSE: THREE.MOUSE,
        Vector2: THREE.Vector2,
        Vector3: THREE.Vector3,
        Vector4: THREE.Vector4,
        Quaternion: THREE.Quaternion,
        Matrix4: THREE.Matrix4,
        Spherical: THREE.Spherical,
        Box3: THREE.Box3,
        Sphere: THREE.Sphere,
        Raycaster: THREE.Raycaster,
        MathUtils: THREE.MathUtils,
    }
});

export class ThreeJS implements OBC.Disposable {
    readonly onDisposed: OBC.Event<any> = new OBC.Event();

    private _scene: THREE.Scene = new THREE.Scene();
    private _perspectiveCamera!: THREE.PerspectiveCamera;
    private _orthographicCamera!: THREE.OrthographicCamera;
    private _renderer!: THREE.WebGLRenderer;
    private _labelRenderer!: THREE.CSS2DRenderer;
    private _controls!: CameraControls;
    private _clock!: THREE.Clock;
    public currentCamera!: THREE.PerspectiveCamera | THREE.OrthographicCamera;

    //tool
    private _axes!: THREE.AxesHelper;
    private _ambientLight!: THREE.AmbientLight;
    private _directionalLight!: THREE.DirectionalLight;

    private _projection = false; // false: OrthographicCamera true: PerspectiveCamera

    set projection(projection: boolean) {
        if (projection === this._projection) return;
        this._projection = projection;
        if (!this._perspectiveCamera) this._perspectiveCamera = this.initPerspectiveCamera();
        if (!this._orthographicCamera) this._orthographicCamera = this.initOrthographicCamera();
        this.currentCamera = projection ? this._perspectiveCamera : this._orthographicCamera;
    }
    get projection(): boolean {
        return this._projection;
    }

    set clearAlpha(alpha: number) {
        if (alpha < 0 || alpha > 1 || !this._renderer) return
        this._renderer.setClearAlpha(alpha);
    }
    set setupEvent(setupEvent: boolean) {
        if (setupEvent) {
            window.addEventListener("resize", this.onReSize)
        } else {
            window.removeEventListener("resize", this.onReSize)
        }
    }

    constructor(
        private container: HTMLDivElement,
        private canvas: HTMLCanvasElement
    ) {
        this.projection = true;
        this._renderer = this.initRenderer();
        this._labelRenderer = this.initLabelRenderer();
        this._controls = this.initControls();
        this._clock = this.initClock();
        this.initTool();
        this.init();
        this.setupEvent = true;
    }

    async dispose() {
        this.setupEvent = false;
        this._renderer?.dispose();
        this._labelRenderer?.domElement.remove();
        await this.onDisposed.trigger();
        this.onDisposed.reset();
        this._controls.dispose();
        this._clock?.stop();
        this._renderer.renderLists.dispose();
        console.log("ThreeJS was Disposed!")
    }

    private initPerspectiveCamera(): THREE.PerspectiveCamera {
        //45 : Fov
        //1: distance(camera, near) = 1m
        //1000: distance(camera, Far plane) = 1000m
        // width, height = rectangle of viewport
        //aspect: result of w&h of viewport
        const { width, height } = this.container.getBoundingClientRect();
        const camera = new THREE.PerspectiveCamera(45, width / height, near, far);
        camera.position.copy(pos0);
        return camera;
    }
    private initOrthographicCamera(): THREE.OrthographicCamera {
        const { width, height } = this.container.getBoundingClientRect();
        const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, near, far)
        camera.position.copy(pos0);
        return camera;
    }
    private initRenderer(): THREE.WebGLRenderer {
        const { width, height } = this.container.getBoundingClientRect();
        const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false, preserveDrawingBuffer: true });
        renderer.setSize(width, height, true);
        // set Pixel Ratio
        renderer.setPixelRatio(window.devicePixelRatio * 2);
        const domElement = renderer.domElement;
        this.container.appendChild(domElement)
        return renderer;
    }
    private initLabelRenderer(): CSS2DRenderer {
        const { width, height } = this.container.getBoundingClientRect();
        const labelRenderer = new CSS2DRenderer;
        labelRenderer.setSize(width, height);
        const domElement = labelRenderer.domElement;
        this.container.appendChild(domElement)
        return labelRenderer;
    }
    //https://github.com/ThatOpen/engine_components/blob/main/src/core/SimpleCamera/index.ts
    private initControls(): CameraControls {
        const cameraControls = new CameraControls(this.currentCamera, this._renderer.domElement);
        cameraControls.smoothTime = 0.25;
        return cameraControls;
    }

    private initClock() {
        const clock = new THREE.Clock();
        clock.start();
        return clock;
    }

    private gameLoop = () => {
        if (!this.currentCamera || !this._controls || !this._renderer || !this._labelRenderer) return;
        const delta = this._clock.getDelta();
        const isUpdate = this._controls.update(delta * 10);
        if (isUpdate) {
            this._renderer.render(this._scene, this.currentCamera);
            this._labelRenderer.render(this._scene, this.currentCamera);
        }
        this._renderer.setAnimationLoop(this.gameLoop)

    }
    private initTool() {
        this._axes = new THREE.AxesHelper(1);
        this._scene.add(this._axes);
    }

    private onReSize = () => {
        if (!this._renderer || !this._labelRenderer) return
        const { width, height } = this.container.getBoundingClientRect();
        this._renderer.setSize(width, height);
        this._labelRenderer.setSize(width, height);
    }

    init() {
        this.gameLoop();
        this.clearAlpha = 0;
        this._scene.background = new THREE.Color('#366B60');
    }

}