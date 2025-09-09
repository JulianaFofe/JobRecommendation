
import Dashboard from "./components//EmployeeDashboard/Dashboard";
import DashView from "./components/dashboardView";
import Employer from "./components/Employer";
import Management from "./components/usermanagement";
import Footer from "./containers/footer";
import Signup from "./components/signup";
import Login from "./components/login"
import Testimonials from "./components/tesmimonials/index";



import Home from "./containers/home";

import type { JobCard } from "./types/jobcard";

import { Route, Routes } from "react-router-dom";
import Hero from "./components/getstarted";
import Goals from "./components/how_it_work";
import Navbar from "./components/EmployeeDashboard/Navbar";

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
        <Route path="/works" element = {<Goals/>}/>
        <Route path="/getstarted" element = {<Hero/>}/>
        <Route path="/employer" element={<Employer/>}/>
        <Route path="/dashview" element={<DashView/>} />
        <Route path="management" element={<Management/>}></Route>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/stories" element={<Testimonials/>} />

        <Route path="/employeedash" element={<Dashboard cards={cards} />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
