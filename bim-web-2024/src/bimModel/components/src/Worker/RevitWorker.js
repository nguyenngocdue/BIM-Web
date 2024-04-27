import 'pako';

const int32 = new Int32Array(2);
new Float32Array(int32.buffer);
new Float64Array(int32.buffer);
new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;

var Encoding;
(function (Encoding) {
    Encoding[Encoding["UTF8_BYTES"] = 1] = "UTF8_BYTES";
    Encoding[Encoding["UTF16_STRING"] = 2] = "UTF16_STRING";
})(Encoding || (Encoding = {}));

self.onmessage = async (e) => {
    const { action, payload } = e.data;
    // const handler = handleMap[action as keyof typeof handleMap];
    // if (handler) handler(payload);
    console.log(action, payload);
};
