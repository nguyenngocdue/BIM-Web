import * as THREE from "three";

export class RayCast {
    private rayCaster = new THREE.Raycaster();
    private pointer = new THREE.Vector2();
    // private readonly origin = new THREE.Vector3();

    set setupEvent(setupEvent: boolean) {
        if (!this.domElement) return;
        if (setupEvent) {
            this.domElement.addEventListener("pointermove", this.onPointerMove);
        } else {
            this.domElement.removeEventListener("pointermove", this.onPointerMove);
        }
    }

    // private plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -3);

    constructor(
        private domElement: HTMLCanvasElement,
        // private scene: THREE.Scene,
        private camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
    ) {
        this.setupEvent = true;
    }

    async dispose() {
        this.setupEvent = false;
    }

    private onPointerMove = (event: any) => {
        const { width, height } = this.domElement.getBoundingClientRect();
        this.pointer.x = (event.clientX / width) * 2 - 1;
        this.pointer.y = (event.clientY / height) * 2 + 1;
        this.rayCaster.setFromCamera(this.pointer, this.camera);
        // const point = this.rayCaster.ray.intersectsPlane(this.plane, this.origin);
        // console.log(point);

    }

}
