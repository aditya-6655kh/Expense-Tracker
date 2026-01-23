import React, { use } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard.jsx";
import LandingPage from "./components/LandingPage2.jsx";
export default function App() {
  return (
    // <Router>
    //   <div className="min-h-screen bg-grey-100 flex item-center justify-center p-5">
    //     <Routes>
    //       <Route path="/" element={<Dashboard />} />
    //       <Route path="*" element={<h1>404 - Not Found</h1>} />
    //     </Routes>
    //   </div>
    // </Router>
    <LandingPage />
  );
}
