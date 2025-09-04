import { Routes, Route } from 'react-router-dom';
import './App.css'
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashView from './components/dashboardView';
import Home from './containers/home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admindash" element={<DashView />} />
    </Routes>
  )
}

export default App;
