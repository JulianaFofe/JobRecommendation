import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashView from './components/dashboardView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard_overview" element={<DashView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
