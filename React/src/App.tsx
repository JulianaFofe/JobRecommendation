import { Routes, Route } from "react-router-dom";
import "./App.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashView from "./components/dashboardView";
import Home from "./containers/home";
import Employer from "./components/Employer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admindash" element={<DashView />} />
      <Route path="/employer" element={<Employer />} />
    </Routes>
  );
}

export default App;
