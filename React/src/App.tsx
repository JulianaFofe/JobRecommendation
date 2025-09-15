import Dashboard from "./components/EmployeeDashboard/Dashboard";
import DashView from "./components/dashboardView";
import Employer from "./components/Employer";
import Management from "./components/usermanagement";
import Footer from "./containers/footer";
import Signup from "./components/signup";
import Login from "./components/login";
import Testimonials from "./components/tesmimonials";
import Job from "./components/Jobmanagement";
import Help_Center from "./components/helpcenter/index";
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
import PublicProfile from "./components/profileview";
import About from "./components/about";
import Employee_Form from "./components/employee_form/index"
import AdminFeedback from "./components/feedback/adminsfeedback";
import Employee_Form from "./components/employee_form/index"

function App() {
  const cards: JobCard[] = [
    { id: "c1", title: "Jom-Job", ctaText: "Apply" },
    { id: "c2", title: "Save Jobs Easily", ctaText: "Apply" },
    { id: "c3", title: "Track Applicants", ctaText: "Apply" },
  ];
  const person = {
    name: "Fedjio Noumbissi",
    skills: ["React", "Node.js", "TypeScript", "TailwindCSS", "FastAPI"],
    experience: [
      {
        role: "Frontend Developer",
        company: "Tech Solutions Inc.",
        duration: "Jan 2022 – Present",
      },
      {
        role: "Intern Software Engineer",
        company: "InnovateHub",
        duration: "Jun 2020 – Dec 2021",
      },
    ],
    education: [
      {
        degree: "B.Sc. Computer Science",
        school: "University of Yaounde",
        year: "2017 – 2021",
      },
      {
        degree: "High School Diploma",
        school: "GBHS Bafoussam",
        year: "2013 – 2017",
      },
    ],
  };
  return (
    <div>
      <Routes>
        <Route path="/emplo" element={<Employee_Form />} />
        <Route path="/profile" element={<PublicProfile person={person} />} />
        <Route path="/" element={<Home />} />
        <Route path="/feedadmins" element={<AdminFeedback />} />
        <Route path="/works" element={<Goals />} />
        <Route path="/getstarted" element={<Hero />} />
        <Route
          path="/employer"
          element={
            <ProtectedRoute>
              <Employer />
            </ProtectedRoute>
          }
        />
        <Route path="/dashview" element={<DashView />} />
        <Route path="/management" element={<Management />} />
        <Route path="/helpcenter" element={<Help_Center/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/stories" element={<Testimonials />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/service" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/employeedash" element={<Dashboard cards={cards} />} />
        <Route path="/jobmanagement" element={<Job />} />
        <Route path="employee_form" element={<Employee_Form/>}/>
        <Route path="/jobform" element={<JobForm />} />          {/* Create */}
        <Route path="/jobform/:id" element={<JobForm />} />      {/* Update */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
