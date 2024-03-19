import { ToastContainer } from 'react-toastify';
// import "react-toastify/diat/ReactToastify.css"
import './App.css'
import { useEffect, useRef } from 'react';
import { ThreeJS } from './bimModel';

function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const threeJs = new ThreeJS(containerRef.current!, canvasRef.current!);
    return () => {
      console.log("Dispose!");
      threeJs?.dispose();
    }
  }, [])



  return (
    <>
      <div className="relative h-full w-full bg-indigo-300" ref={containerRef}>
        <canvas className="absolute h-full w-full" ref={canvasRef}></canvas>
      </div>
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
