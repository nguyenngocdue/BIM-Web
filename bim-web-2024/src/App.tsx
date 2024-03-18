import { ToastContainer } from 'react-toastify';
// import "react-toastify/diat/ReactToastify.css"
import './App.css'
import { useEffect, useRef } from 'react';
import { ThreeJS } from './bimModel';

function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    console.log("Init");
    const threeJs = new ThreeJS(containerRef.current!);
    return () => {
      console.log("Dispose!");
      threeJs?.dispose();
    }
  }, [])



  return (
    <>
      <div className="relative h-full w-full bg-indigo-300" ref={containerRef}>H</div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        rtl={false}
        theme="light"
      />
    </>
  )
}

export default App
