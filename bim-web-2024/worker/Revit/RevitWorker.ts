import { Decompress } from "./decompress";

const onSuccess = (result: any) => {
    self.postMessage({ result });
}

const onError = (error: any) => {
    self.postMessage({ error });
}

const onLoad = async (payload: Uint8Array) => {
    await new Decompress(onSuccess, onError).readFile(payload);
}
const handleMap = {
    onLoad
};
self.onmessage = async (e: MessageEvent) => {
    const { action, payload } = e.data;
    // const handler = handleMap[action as keyof typeof handleMap];
    // if (handler) handler(payload);
    console.log(action, payload);
}