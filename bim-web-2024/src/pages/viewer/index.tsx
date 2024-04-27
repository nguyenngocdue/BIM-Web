import { useEffect, useRef } from "react";
import { BasicComponent } from "../../bimModel";

const Viewer = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const threeJs = new BasicComponent(containerRef.current!);
        return () => {
            console.log("Dispose!");
            threeJs?.dispose();
        }
    }, [])
    return <div className="relative h-full w-full" ref={containerRef}></div>;
};
export default Viewer; 