
import Dashboard from "./components//EmployeeDashboard/Dashboard";
import DashView from "./components/dashboardView";
import Employer from "./components/Employer";
import Footer from "./containers/footer";

import Home from "./containers/home";

import type { JobCard } from "./types/jobcard";

import { Route, Routes } from "react-router-dom";

function App() {
  const cards: JobCard[] = [
    { id: "c1", title: "Jom-Job", ctaText: "Apply" },
    { id: "c2", title: "Save Jobs Easily", ctaText: "Apply" },
    { id: "c3", title: "Track Applicants", ctaText: "Apply" },
  ];

  return (
    <div>
      <Routes>
        <Route path="/" element = {<Home/>}></Route>
        <Route path="/employer" element={<Employer/>}/>
        <Route path="/dashview" element={<DashView/>} />
        <Route path="/employeedash" element={<Dashboard cards={cards} />} />
        {/* <Footer/> */}
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
