import { ToastContainer } from 'react-toastify';
// import "react-toastify/diat/ReactToastify.css"
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Viewer from './pages/viewer';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<div>Hello</div >} />
          <Route path="/viewer" element={<Viewer />} />
          <Route path="*" element={<div>Error</div>} />
        </Routes>
      </BrowserRouter>
      {/* <div className="relative h-full w-full bg-indigo-300" ref={containerRef}>
      </div> */}
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
