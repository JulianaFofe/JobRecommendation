import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../../assets/images/img.png";
import type { SidebarItem } from "../../types/sidebar";
import SidebarWrapper from "../EmployeeDashboard/hamburger";
import { Home, FileText, Users, UserCircle, Settings, LogOut } from "lucide-react";

type ProfileData = {
  id: number;
  user_id: number;
  username: string;   // 👈 added username
  skills?: string;
  experience?: string;
  education?: string;
  resume_url?: string;
};

export default function PublicProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No token found, user must log in.");
          return;
        }

        const response = await axios.get<ProfileData>(
          "http://127.0.0.1:8000/profiles/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const sidebarItems: SidebarItem[] = [
    { id: "home", title: "Home", path: "/employeedash", icon: Home },
    { id: "review", title: "Review Jobs", path: "/review", icon: FileText },
    { id: "applicants", title: "Applicants", path: "/applicants", icon: Users },
    { id: "profile", title: "Profile", path: "/profile", icon: UserCircle },
    { id: "settings", title: "Settings", path: "/settings", icon: Settings },
    { id: "logout", title: "Logout", path: "/", icon: LogOut },
  ];

  const renderAchievementsAsList = (text?: string) => {
    if (!text) return <p className="text-sm text-gray-500">—</p>;
    const items = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 0) return <p className="text-sm text-gray-500">—</p>;
    return (
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <SidebarWrapper items={sidebarItems} />
      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex justify-center items-start p-6">
          <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl p-8 md:p-10">
            {/* Logo */}
            <div className="text-center mb-6">
              <a href="/">
                <img src={logo} alt="Team Logo" className="w-40 h-15 mx-auto" />
              </a>
            </div>

            {/* Username */}
            <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8">
              {profile?.username || "Unknown User"}
            </h1>

            {/* Education */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Education</h2>
              <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                {profile?.education ? (
                  <p className="whitespace-pre-line">{profile.education}</p>
                ) : (
                  "No education provided"
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Skills</h2>
              <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                {renderAchievementsAsList(profile?.skills)}
              </div>
            </div>

            {/* Experience */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Experience</h2>
              <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                {renderAchievementsAsList(profile?.experience)}
              </div>
            </div>

            {/* Resume */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Resume</h2>
              <div className="p-4 border rounded-lg shadow-sm bg-gray-50 text-gray-500">
                {profile?.resume_url ? (
                  <a
                    href={`http://127.0.0.1:8000/${profile.resume_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Resume
                  </a>
                ) : (
                  "No resume uploaded"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
