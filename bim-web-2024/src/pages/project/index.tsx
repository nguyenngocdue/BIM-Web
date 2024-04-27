import React from "react";
import { Tooltip, Card } from "flowbite-react";
import { Link } from "react-router-dom";
import revit from "../../assets/revit.png";
import ifc from "../../assets/ifc.png";

export interface IPlatform {
    src: string;
    tooltip: string;
    path: string;
}



const platform: IPlatform[] = [
    {
        src: revit,
        tooltip: "Revit",
        path: "/viewer?file_type=revit",
    },
    {
        src: ifc,
        tooltip: "Ifc",
        path: "/viewer?file_type=ifc",
    },
    {
        src: revit,
        tooltip: "Revit",
        path: "/viewer?file_type=mapbox",
    },
    {
        src: revit,
        tooltip: "ArcGIS",
        path: "/viewer?file_type=arcgis",

    }
]

const Project = () => {
    return (
        <div className="relative h-full w-full flex justify-center items-center">
            <div className="flex">
                {
                    platform.map((plat: IPlatform, index: number) =>
                        <Card className="mx-2" key={`${plat.path}-${index}`}>
                            <Tooltip
                                content={plat.tooltip}
                                placement="top"
                                className="-translate-y-8"
                            >
                                <div className="relative  h-[250px] w-[250px] flex justify-center items-center">
                                    <Link to={plat.path}>
                                        <img src={plat.src} alt={plat.src} />
                                    </Link>
                                </div>
                            </Tooltip>
                        </Card>
                    )
                }
            </div>
        </div>
    )
}
export default Project;