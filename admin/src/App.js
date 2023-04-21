import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './scenes/home/home';
import Sidebar from "./components/sidebar/sidebar";
import Topbar from "./components/topbar/topbar";
import "./App.css";

function App() {

  return (
    <BrowserRouter>
      <Topbar />
      <div className="container">
        <Sidebar />
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


// function App() {
//   return (
//   );
// }

// export default App;
