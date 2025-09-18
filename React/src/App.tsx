import Dashboard from "./components/EmployeeDashboard/Dashboard";
import DashView from "./components/dashboardView";
import Employer from "./components/Employer";
import Management from "./components/usermanagement";
import Footer from "./containers/footer";
import Signup from "./components/signup";
import Login from "./components/login";
import Testimonials from "./components/tesmimonials";
import Job from "./components/Jobmanagement";
import Employee_Form from "./components/employee_form/index";
//port Jobstate from "./components/Adminaprove/index";

import Home from "./containers/home";
import { Route, Routes } from "react-router-dom";
import Hero from "./components/getstarted";
import Goals from "./components/how_it_work";
import FeedbackPage from "./components/feedback/feedbackuser";
import Services from "./components/service";
import JobForm from "./components/JobForm";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicProfile from "./components/profileview";
import About from "./components/about";
import AdminFeedback from "./components/feedback/adminsfeedback";
//port PendingUsers from "./components/pendingusers";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/employee" element={<Employee_Form />} />

        {/* Profile page (props removed, since profileview has hardcoded data) */}
        <Route path="/profile" element={<PublicProfile />} />

        <Route path="/" element={<Home />} />
        <Route path="/feedadmins" element={<AdminFeedback />} />
        <Route path="/works" element={<Goals />} />
        <Route path="/getstarted" element={<Hero />} />

        {/* Protected Employer Route */}
        <Route
          path="/employer"
          element={
            <ProtectedRoute>
              <Employer />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/pending-users" element={<PendingUsers />} /> */}
        <Route path="/dashview" element={<DashView />} />
        <Route path="/management" element={<Management />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/stories" element={<Testimonials />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/service" element={<Services />} />
        {/* <Route path="/jobstate" element={<Jobstate />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/employeedash" element={<Dashboard />} />
        <Route path="/jobmanagement" element={<Job />} />

        {/* JobForm routes for Create & Update */}
        <Route path="/jobform" element={<JobForm />} />
        <Route path="/jobform/:id" element={<JobForm />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
