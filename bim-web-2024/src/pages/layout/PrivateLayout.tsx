import { Tooltip } from 'flowbite-react';
import React from 'react';
import bim from "../../assets/bim.jpg";
import { Link, Outlet } from 'react-router-dom';

const PrivateLayout = () => {
    return (
        <div className='relative h-full w-full flex flex-col'>
            <div className="relative w-full h-[60px] px-2 py-1 bg-blue-400 flex justify-between">
                <Link to={"/"} className="rounded-md w-[100px] p-1">
                    <Tooltip content="Bim Platform" placement="left">
                        <img src={bim} alt="" className="h-full w-full rounded-xl" />
                    </Tooltip>
                </Link>
            </div>
            <div className="relative w-full flex-1 m-0 p-0">
                <Outlet />
            </div>
        </div>
    )
}

export default PrivateLayout