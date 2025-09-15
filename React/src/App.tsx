import Dashboard from "./components/EmployeeDashboard/Dashboard";
import DashView from "./components/dashboardView";
import Employer from "./components/Employer";
import Management from "./components/usermanagement";
import Footer from "./containers/footer";
import Signup from "./components/signup";
import Login from "./components/login";
import Testimonials from "./components/tesmimonials";
import Job from "./components/Jobmanagement";
import Employee_Form from "./components/employee_form/index"
//import About from "./components/about";

import Home from "./containers/home";
import type { JobCard } from "./types/jobcard";

import { Route, Routes } from "react-router-dom";
import Hero from "./components/getstarted";
import Goals from "./components/how_it_work";
import FeedbackPage from "./components/feedback/feedbackuser";
import Services from "./components/service";
import JobForm from "./components/JobForm";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./components/about";
import AdminFeedback from "./components/feedback/adminsfeedback";

function App() {
  const cards: JobCard[] = [
    { id: "c1", title: "Jom-Job", ctaText: "Apply" },
    { id: "c2", title: "Save Jobs Easily", ctaText: "Apply" },
    { id: "c3", title: "Track Applicants", ctaText: "Apply" },
  ];

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedadmins" element={<AdminFeedback />} />
        <Route path="/works" element={<Goals />} />
        <Route path="/getstarted" element={<Hero />} />
        <Route path="/employer" element={<ProtectedRoute><Employer /></ProtectedRoute>} />
        <Route path="/dashview" element={<DashView />} />
        <Route path="/management" element={<Management />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/stories" element={<Testimonials />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/service" element={<Services />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/employeedash" element={<Dashboard cards={cards} />} />
        <Route path="/jobmanagement" element={<Job />} />
        <Route path="/jobform" element={<JobForm />} />          {/* Create */}
        <Route path="employee_form" element={<Employee_Form/>}/>
        <Route path="/jobform/:id" element={<JobForm />} />      {/* Update */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
