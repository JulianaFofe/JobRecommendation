import React, { useState } from "react";
import {
  Search,
  BookOpen,
  MessageCircle,
  LifeBuoy,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  { q: "1. How do I create an account?", a: "Go to the signup page, fill in your details, and follow the instructions to create your account." },
  { q: "2. Do I need to pay to apply for jobs?", a: "No, applying for jobs is completely free on our platform." },
  { q: "3. How do I improve my chances of getting hired?", a: "Make sure your profile is complete, upload a professional resume, and apply to jobs that match your skills." },
  { q: "4. Can I apply to jobs without uploading a resume?", a: "Some employers may allow it, but we recommend uploading a resume for better chances." },
  { q: "5. How do I know if my application was successful?", a: "You will receive a confirmation email and can track your application status in your dashboard." },
  { q: "6. How do I set up job alerts?", a: "Go to your settings and enable job alerts to get notified about new opportunities." },
  { q: "7. Can I edit or delete my profile after creating it?", a: "Yes, you can always edit or delete your profile from the account settings page." },
  { q: "8. Are the jobs on this site verified?", a: "Yes, all jobs are reviewed and verified before being published on the site." },
];

const Help_Center = () => {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== "") {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        "_blank"
      );
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center mb-12">
      {/* Hero Section */}
      <section className="w-full bg-primary text-white py-16 px-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-center">Help Center</h1>
        <p className="text-lg max-w-2xl text-center mb-8">
          Find answers, guides, and support for using our platform. Whether
          you're a job seeker or an employer, we’ve got resources to help you
          succeed.
        </p>

        {/* Responsive Search Bar */}
        <form
          onSubmit={handleSearch}
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:max-w-xl flex bg-white rounded-lg shadow overflow-hidden"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in Google..."
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 text-sm sm:text-base outline-none"
          />
          <button
            type="submit"
            className="w-14 sm:w-16 bg-secondary flex items-center justify-center hover:bg-secondary/90 transition"
          >
            <Search className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </form>
      </section>

      {/* Categories */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 px-6 max-w-6xl w-full">
        {[
          { id: "getting-started", icon: <BookOpen className="w-10 h-10 text-primary mx-auto mb-4" />, title: "Getting Started", desc: "Learn the basics of creating a profile and finding jobs." },
          { id: "employer-guide", icon: <FileText className="w-10 h-10 text-primary mx-auto mb-4" />, title: "Employer Guide", desc: "Post jobs, manage applicants, and discover top talent." },
          { id: "faq", icon: <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />, title: "FAQs", desc: "Find quick answers to common questions." },
          { id: "how-it-works", icon: <LifeBuoy className="w-10 h-10 text-primary mx-auto mb-4" />, title: "How It Works", desc: "Pick what you need, follow the steps, and get results." },
        ].map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveSection(item.id)}
          >
            {item.icon}
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Dynamic Sections */}
      <section className="mt-12 px-6 max-w-5xl w-full">
        <AnimatePresence mode="wait">
          {activeSection === "getting-started" && (
            <motion.div
              key="getting-started"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-white shadow-lg rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-primary mb-4">
                Getting Started
              </h2>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Create an account with your email or social profile.</li>
                <li>Build your profile by adding your skills, experience, and resume.</li>
                <li>Browse jobs with filters that fit your goals.</li>
                <li>Apply with one click and track your applications.</li>
              </ul>
            </motion.div>
          )}

          {activeSection === "employer-guide" && (
            <motion.div
              key="employer-guide"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-white shadow-lg rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-primary mb-4">
                Employer Guide
              </h2>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Create your company profile and showcase your brand.</li>
                <li>Post jobs with clear descriptions to attract talent.</li>
                <li>Manage applicants with a simple dashboard.</li>
                <li>Discover and reach out to job seekers directly.</li>
                <li>Promote jobs with featured listings for faster results.</li>
              </ul>
            </motion.div>
          )}

          {activeSection === "faq" && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-white shadow-lg rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-primary">
                Frequently Asked Questions
              </h2>
              {FAQS.map((faq, index) => (
                <div key={index}>
                  <p
                    className="py-2 px-3 text-sm md:text-base text-gray-700 font-semibold border-t border-gray-200 cursor-pointer"
                    onClick={() => toggleFAQ(index)}
                  >
                    {faq.q}
                  </p>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="py-2 px-3 text-xs md:text-sm max-w-md text-gray-600"
                      >
                        {faq.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}

          {activeSection === "how-it-works" && (
            <motion.div
              key="how-it-works"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-white shadow-lg rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-primary mb-4">
                How It Works
              </h2>
              <h3 className="font-semibold text-gray-800 mb-2">For Job Seekers:</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Sign up and build your profile.</li>
                <li>Browse opportunities using filters.</li>
                <li>Apply quickly and track your progress.</li>
              </ul>
              <h3 className="font-semibold text-gray-800 mb-2">For Employers:</h3>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Create your company profile.</li>
                <li>Post jobs and reach candidates instantly.</li>
                <li>Manage applications from one dashboard.</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Call to Action */}
      <section className="mt-16 bg-secondary text-white py-12 px-6 w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-center">Still need help?</h2>
        <p className="max-w-xl text-center mb-6">
          Our support team is here to guide you. Reach out to us for
          personalized help.
        </p>
        <a href="https://wa.me/237683861566">
        <button className="bg-white text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          
          Contact Support
        </button>
        </a>
      </section>
    </div>
  );
};

export default Help_Center;
