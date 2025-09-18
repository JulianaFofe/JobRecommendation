import logo from "../../assets/images/img.png";
import type { SidebarItem } from "../../types/sidebar";
import SidebarWrapper from "../EmployeeDashboard/hamburger";
import NavBar from "../EmployeeDashboard/Navbar";
import {
  Home,
  FileText,
  Users,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";

export default function PublicProfile() {
  // Static test data
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

  // Sidebar
  const sidebarItems: SidebarItem[] = [
    { id: "home", title: "Home", path: "/employeedash", icon: Home },
    { id: "review", title: "Review Jobs", path: "/review", icon: FileText },
    { id: "applicants", title: "Applicants", path: "/applicants", icon: Users },
    { id: "profile", title: "Profile", path: "/profile", icon: UserCircle },
    { id: "settings", title: "Settings", path: "/settings", icon: Settings },
    { id: "logout", title: "Logout", path: "/", icon: LogOut },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <SidebarWrapper items={sidebarItems} />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex justify-center items-center p-6">
          <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl p-6 md:p-10">
            {/* Logo */}
            <div>
              <a href="/">
                <img src={logo} alt="Team Logo" className="w-40 h-15" />
              </a>
              <div className="py-4"></div>
            </div>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-800">
                {person.name}
              </h1>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Education */}
            {person.education && person.education.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Education
                </h2>
                <div className="space-y-4">
                  {person.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg shadow-sm bg-gray-50"
                    >
                      <h3 className="text-lg font-semibold text-gray-700">
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600">{edu.school}</p>
                      <span className="text-sm text-gray-500">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {person.skills && person.skills.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {person.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-full text-sm shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {person.experience && person.experience.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Experience
                </h2>
                <div className="space-y-4">
                  {person.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg shadow-sm bg-gray-50"
                    >
                      <h3 className="text-lg font-semibold text-gray-700">
                        {exp.role}
                      </h3>
                      <p className="text-gray-600">{exp.company}</p>
                      <span className="text-sm text-gray-500">
                        {exp.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
