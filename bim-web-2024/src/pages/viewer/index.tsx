import { useEffect, useRef } from "react";
import { BasicComponent } from "../../bimModel";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

const Viewer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [searchParams] = useSearchParams();
    const file_type = searchParams.get("file_type");
    useEffect(() => {
        if (!file_type) {
            navigate("/project");
            return;
        }
        const bim = new BasicComponent(containerRef.current!);
        return () => {
            bim?.dispose();
        };
    }, [location])
    return <div className="relative h-full w-full" ref={containerRef}></div>;
};
export default Viewer; 