// Employee_Form.tsx
import React, { useState, useEffect, type FormEvent } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import logo from "../../assets/icons/logo1.png";
import axios from "axios";

type ProfileData = {
  id: number;
  user_id: number;
  username: string;
  email: string;
  skills?: string;
  experience?: string;
  education?: string;
  resume_url?: string;
  name?: string;
  contact_email?: string;
};

const Employee_Form: React.FC = () => {
  const [isEditView, setIsEditView] = useState(true);

  // Profile states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [experienceAchievements, setExperienceAchievements] = useState("");
  const [educationCertification, setEducationCertification] = useState("");
  const [skills, setSkills] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const response = await axios.get<ProfileData>(
          "http://127.0.0.1:8000/profile/",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const profile = response.data;
        setUsername(profile.username);
        setEmail(profile.email);
        setName(profile.name || "");
        setContactEmail(profile.contact_email || "");
        setExperienceAchievements(profile.experience || "");
        setEducationCertification(profile.education || "");
        setSkills(profile.skills || "");
        setResumeUrl(profile.resume_url ?? null);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Toggle + submit
  const handleToggleView = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (isEditView) {
      if (!experienceAchievements.trim() || !skills.trim()) {
        alert("Please fill in Experience and Skills.");
        return;
      }

      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        setIsSubmitting(true);
        setIsSuccess(false);

        // Save profile
        await axios.post(
          "http://127.0.0.1:8000/profile/",
          {
            skills,
            education: educationCertification,
            experience: experienceAchievements,
            name,
            contact_email: contactEmail,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Upload CV if selected
        if (cvFile) {
          const formData = new FormData();
          formData.append("file", cvFile);

          const res = await axios.post<ProfileData>(
            "http://127.0.0.1:8000/profile/upload-resume",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setResumeUrl(res.data.resume_url ?? null);
        }

        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2500);
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
      } finally {
        setIsSubmitting(false);
      }
    }

    setIsEditView((s) => !s);
  };

  const renderAchievementsAsList = (text: string) => {
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <aside className="md:col-span-1 flex flex-col items-center md:items-start">
            <div className="w-full mt-4">
              <div className="flex justify-center items-center pt-10 pb-7 align-center">
                <img src={logo} alt="SmartHire Logo" className="w-32 mb-6" />
              </div>
              <div className="text-primary flex justify-center items-center pb-10">
                <p className="text-center font-bold text-3xl tracking-wide uppercase border-b-2 border-primary pb-1">
                  Profile
                </p>
              </div>
              {isEditView ? (
                <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Full Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Alternative email"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Username
                    </label>
                    <input
                      value={username}
                      disabled
                      className="mt-1 block w-full rounded-md border border-gray-300 text-sm p-2 bg-gray-100"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      value={email}
                      disabled
                      className="mt-1 block w-full rounded-md border border-gray-300 text-sm p-2 bg-gray-100"
                    />
                  </div>

                  {/* Upload CV */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Upload CV
                    </label>
                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg cursor-pointer shadow hover:bg-primary/90 transition">
                      <Upload size={16} />
                      <span>{cvFile ? "Change CV" : "Choose File"}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          setCvFile(e.target.files ? e.target.files[0] : null)
                        }
                        className="hidden"
                      />
                    </label>
                    {cvFile && (
                      <p className="mt-1 text-xs text-gray-500">Selected: {cvFile.name}</p>
                    )}
                  </div>
                </form>
              ) : (
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Name:</span> {name || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Contact Email:</span>{" "}
                    {contactEmail || "—"}
                  </p>
                  <p className="pt-4">
                    <span className="font-semibold">Username:</span> {username || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {email || "—"}
                  </p>

                  {resumeUrl ? (
                    <a
                      href={`http://127.0.0.1:8000/${resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline"
                    >
                      View CV
                    </a>
                  ) : (
                    <p className="text-xs text-gray-400">No CV uploaded</p>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Rest unchanged */}
          <main className="md:col-span-2 space-y-6">
            <section>
              <h3 className="text-md font-semibold text-primary mb-2">
                Experience <span className="text-red-500">*</span>
              </h3>
              <div className="p-4 rounded-lg border border-gray-300 bg-primary/5">
                {isEditView ? (
                  <textarea
                    value={experienceAchievements}
                    onChange={(e) => setExperienceAchievements(e.target.value)}
                    rows={4}
                    placeholder="- Built feature X\n- Improved Y by 30%"
                    required
                    className="w-full rounded-md p-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="mt-2">{renderAchievementsAsList(experienceAchievements)}</div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-md font-semibold text-primary mb-2">Education</h3>
              <div className="p-4 rounded-lg border border-gray-300 bg-primary/5">
                {isEditView ? (
                  <textarea
                    value={educationCertification}
                    onChange={(e) => setEducationCertification(e.target.value)}
                    rows={2}
                    placeholder="Certification / Degree"
                    className="w-full rounded-md p-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-sm text-gray-600 mt-1">{educationCertification || "—"}</p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-md font-semibold text-primary mb-2">
                Skills <span className="text-red-500">*</span>
              </h3>
              <div className="p-4 rounded-lg border border-gray-300 bg-primary/5">
                {isEditView ? (
                  <textarea
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    rows={3}
                    placeholder="List your skills here"
                    required
                    className="w-full rounded-md p-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="whitespace-pre-line text-sm text-gray-700">{skills || "—"}</p>
                )}
              </div>
            </section>

            <div className="flex justify-end mt-6 border-t pt-4">
              <button
                onClick={handleToggleView}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-primary text-white shadow-md hover:shadow-lg hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-primary/40 transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={18} className="text-green-400" />
                    Saved!
                  </>
                ) : (
                  <>{isEditView ? "Submit" : "Edit Profile"}</>
                )}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Employee_Form;
