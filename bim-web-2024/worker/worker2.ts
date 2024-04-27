import * as THREE from 'three';
import * as OBC from 'openbim-components';
self.onmessage = async (e: MessageEvent) => {
    const { action, payload } = e.data;
    if (action === "init") {
        const vector = new THREE.Vector3();
        const component = new OBC.Components();
        self.postMessage({ action: "init", payload: { payload: payload, message: "response from worker 2!" } });
    }
}