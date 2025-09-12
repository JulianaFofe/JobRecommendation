// Employee_Form.tsx
import React, { useState, ChangeEvent, type FormEvent } from "react";
import { User, Plus } from "lucide-react";

type Experience = {
  id: string;
  company: string;
  duration: string;
  achievements: string; // multiline text area; each newline becomes a bullet
};

type Education = {
  id: string;
  institution: string;
  certification: string;
  duration: string;
};

const makeId = (prefix = "") =>
  prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const Employee_Form: React.FC = () => {
  const [isEditView, setIsEditView] = useState(true);

  // Basic profile info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  // Experiences
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: makeId("exp_"),
      company: "",
      duration: "",
      achievements: "",
    },
  ]);

  // Education
  const [education, setEducation] = useState<Education[]>([
    {
      id: makeId("edu_"),
      institution: "",
      certification: "",
      duration: "",
    },
  ]);

  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Handlers - profile
  const handleToggleView = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsEditView((s) => !s);
  };

  // Experiences handlers
  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      { id: makeId("exp_"), company: "", duration: "", achievements: "" },
    ]);
  };

  const updateExperienceField = (
    idx: number,
    field: keyof Experience,
    value: string
  ) => {
    setExperiences((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const removeExperience = (idx: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== idx));
  };

  // Education handlers
  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      { id: makeId("edu_"), institution: "", certification: "", duration: "" },
    ]);
  };

  const updateEducationField = (
    idx: number,
    field: keyof Education,
    value: string
  ) => {
    setEducation((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const removeEducation = (idx: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== idx));
  };

  // Skills handlers
  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (skills.includes(v)) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, v]);
    setSkillInput("");
  };

  const removeSkill = (i: number) => {
    setSkills((prev) => prev.filter((_, idx) => idx !== i));
  };

  // Helpers for profile display
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
    <div className="max-w-4xl mx-auto p-2 ">
      <div className="bg-white shadow-md rounded-2xl overflow-hidden border-1 border-gray-100 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left column: Avatar + Basic info */}
          <aside className="md:col-span-1 flex flex-col items-center md:items-start">
            <div className="w-36 h-36 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              {/* placeholder avatar */}
              <User className="w-16 h-16 text-primary" />
            </div>

            {/* Basic info (form or display) */}
            <div className="w-full mt-4">
              {isEditView ? (
                <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Full name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-primary/30 shadow-sm text-sm p-2 focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 focus-visible:border-primary"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Title
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md border-primary/30 shadow-sm text-sm p-2 focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 focus-visible:border-primary"
                      placeholder="e.g. Frontend Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border-primary/30 shadow-sm text-sm p-2 focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 focus-visible:border-primary"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Location
                    </label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1 block w-full rounded-md border-primary/30 shadow-sm text-sm p-2 focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 focus-visible:border-primary"
                      placeholder="City, Country"
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-primary">{name}</h2>
                  <p className="text-sm text-gray-600">{title}</p>
                  <p className="text-sm text-gray-500">{email}</p>
                  <p className="text-sm text-gray-500">{location}</p>
                </div>
              )}
            </div>
          </aside>

          {/* Right column: form sections */}
          <main className="md:col-span-2">
            {/* Experience section */}
            <section className="mb-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-md font-semibold text-primary">Experience</h3>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Work history & achievements
                </p>
              </div>

              <div className="mt-3 space-y-4">
                {experiences.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-lg border border-primary/20 bg-primary/5"
                  >
                    {isEditView ? (
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <input
                            value={exp.company}
                            onChange={(e) =>
                              updateExperienceField(idx, "company", e.target.value)
                            }
                            placeholder="Company name"
                            className="flex-1 rounded-md p-2 border border-primary/30 text-sm focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 focus-visible:border-primary"
                          />
                          <input
                            value={exp.duration}
                            onChange={(e) =>
                              updateExperienceField(idx, "duration", e.target.value)
                            }
                            placeholder="Duration (e.g. 2021 - 2023)"
                            className="w-full sm:w-40 rounded-md p-2 border border-primary/30 text-sm focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 focus-visible:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 pt-3">
                            Achievements / Responsibilities (one per line)
                          </label>
                          <textarea
                            value={exp.achievements}
                            onChange={(e) =>
                              updateExperienceField(idx, "achievements", e.target.value)
                            }
                            rows={4}
                            placeholder={"- Built feature X\n- Improved Y by 30%"}
                            className="w-full rounded-md p-2 border border-primary/30 text-sm focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 focus-visible:border-primary"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeExperience(idx)}
                            className="text-xs text-red-600 hover:text-red-800 focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline justify-between">
                          <h4 className="font-medium text-primary">
                            {exp.company || "—"}
                          </h4>
                          <span className="text-sm text-secondary">
                            {exp.duration || "—"}
                          </span>
                        </div>

                        <div className="mt-2">
                          {renderAchievementsAsList(exp.achievements)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3">
                {isEditView && (
                  <button
                    onClick={addExperience}
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashed border-primary text-primary hover:bg-primary/10 focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30"
                  >
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </button>
                )}
              </div>
            </section>

            {/* Skills section */}
            <section className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold text-primary">Skills</h3>
                <p className="text-sm text-gray-500">Add skills as tags</p>
              </div>
              <div className="mt-3">
                {isEditView ? (
                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Type a skill and press +"
                      className="flex-1 rounded-md p-2 border border-primary/30 text-sm focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 focus-visible:border-primary"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="flex items-center justify-center px-3 py-2 rounded-md bg-secondary text-white text-sm hover:opacity-90 shrink-0 focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-secondary/30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.length === 0 && (
                    <p className="text-sm text-gray-500">No skills added yet.</p>
                  )}
                  {skills.map((s, i) => (
                    <div
                      key={s + i}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-sm text-primary"
                    >
                      <span>{s}</span>
                      {isEditView && (
                        <button
                          onClick={() => removeSkill(i)}
                          className="text-xs text-gray-500 hover:text-red-600 focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 rounded"
                          aria-label={`Remove ${s}`}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Education section */}
            <section className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold text-primary">Education</h3>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Academic background
                </p>
              </div>

              <div className="mt-3 space-y-4">
                {education.map((edu, idx) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-lg border border-primary/20 bg-primary/5"
                  >
                    {isEditView ? (
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <input
                            value={edu.institution}
                            onChange={(e) =>
                              updateEducationField(idx, "institution", e.target.value)
                            }
                            placeholder="Institution"
                            className="flex-1 rounded-md p-2 border border-primary/30 text-sm focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 focus-visible:border-primary"
                          />
                          <input
                            value={edu.duration}
                            onChange={(e) =>
                              updateEducationField(idx, "duration", e.target.value)
                            }
                            placeholder="Duration"
                            className="w-full sm:w-40 rounded-md p-2 border border-primary/30 text-sm focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 focus-visible:border-primary"
                          />
                        </div>
                        <div>
                          <input
                            value={edu.certification}
                            onChange={(e) =>
                              updateEducationField(idx, "certification", e.target.value)
                            }
                            placeholder="Certification / Degree"
                            className="w-full rounded-md p-2 border border-primary/30 text-sm focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 focus-visible:border-primary"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeEducation(idx)}
                            className="text-xs text-red-600 hover:text-red-800 focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline justify-between">
                          <h4 className="font-medium text-primary">
                            {edu.institution || "—"}
                          </h4>
                          <span className="text-sm text-secondary">
                            {edu.duration || "—"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {edu.certification || "—"}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3">
                {isEditView && (
                  <button
                    onClick={addEducation}
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashed border-primary text-primary hover:bg-primary/10 focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30"
                  >
                    <Plus className="w-4 h-4" />
                    Add Education
                  </button>
                )}
              </div>
            </section>

            {/* Bottom action button */}
            <div className="mt-6 border-t pt-4 flex justify-end">
              {isEditView ? (
                <button
                  onClick={handleToggleView}
                  className="px-5 py-2 rounded-lg bg-secondary text-white font-medium hover:opacity-95 focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-secondary/30"
                >
                  Update Profile
                </button>
              ) : (
                <button
                  onClick={handleToggleView}
                  className="px-5 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 focus:outline-none <focus-visible:ring-1></focus-visible:ring-1> focus-visible:ring-primary/30"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Employee_Form;
