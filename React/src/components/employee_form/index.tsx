// Employee_Form.tsx
import React, { useState, type FormEvent } from "react";
import { Upload } from "lucide-react";
import logo from "../../assets/icons/logo1.png";

const Employee_Form: React.FC = () => {
  const [isEditView, setIsEditView] = useState(true);

  // Basic profile info
  const [name, setName] = useState("nji sylven");
  const [email, setEmail] = useState("njisylven@gmail.com");

  // Experience
  const [experienceAchievements, setExperienceAchievements] = useState("");

  // Education
  const [educationCertification, setEducationCertification] = useState("");

  // Skills
  const [skills, setSkills] = useState("");

  // CV Upload
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleToggleView = (e?: FormEvent) => {
    if (e) e.preventDefault();

    // ✅ Validation: Require Experience & Skills
    if (isEditView) {
      if (!experienceAchievements.trim() || !skills.trim()) {
        alert("Please fill in both Experience and Skills fields.");
        return;
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
          {/* Left column: Profile info */}
          <aside className="md:col-span-1 flex flex-col items-center md:items-start" >
            <div className="w-full mt-4">
              <div className="flex justify-center items-center pt-10 pb-7 align-center">
                {/* ✅ Slightly larger logo */}
                <img src={logo} alt="SmartHire Logo" className="w-32 mb-6" />
              </div>
              <div className="text-primary flex justify-center items-center pb-10">
                {/* ✅ Better styled Profile heading */}
                <p className="text-center font-bold text-3xl tracking-wide uppercase border-b-2 border-primary pb-1">
                  Profile
                </p>
              </div>
              {isEditView ? (
                <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      User name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Full name"
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="email@example.com"
                    />
                  </div>
                  {/* CV Upload */}
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
                      <p className="mt-1 text-xs text-gray-500">
                        Selected: {cvFile.name}
                      </p>
                    )}
                  </div>
                </form>
              ) : (
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-primary">{name}</h2>
                  <p className="text-sm text-gray-500">{email}</p>
                  <p className="text-xs text-gray-400">
                    {cvFile ? `Uploaded: ${cvFile.name}` : "No CV uploaded"}
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Right column: Sections */}
          <main className="md:col-span-2 space-y-6">
            {/* Experience */}
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
                  <div className="mt-2">
                    {renderAchievementsAsList(experienceAchievements)}
                  </div>
                )}
              </div>
            </section>

            {/* Education */}
            <section>
              <h3 className="text-md font-semibold text-primary mb-2">
                Education
              </h3>
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
                  <p className="text-sm text-gray-600 mt-1">
                    {educationCertification || "—"}
                  </p>
                )}
              </div>
            </section>

            {/* Skills */}
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
                  <p className="whitespace-pre-line text-sm text-gray-700">
                    {skills || "—"}
                  </p>
                )}
              </div>
            </section>

            {/* Bottom action */}
            <div className="flex justify-end mt-6 border-t pt-4">
              <button
                onClick={handleToggleView}
                className="px-6 py-3 rounded-lg font-medium bg-primary text-white shadow-md hover:shadow-lg hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-primary/40 transition-all duration-200"
              >
                {isEditView ? "Submit" : "Edit Profile"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Employee_Form;
