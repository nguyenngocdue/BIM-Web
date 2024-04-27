self.onmessage = async (e: MessageEvent) => {
    console.log(e);
    const { action, payload } = e.data;
    if (action === "init") {
        self.postMessage({ action: "init", payload: { payload: payload, message: "response from worker 1!" } });
    }
}