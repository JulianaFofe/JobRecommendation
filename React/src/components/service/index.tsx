import { motion } from "framer-motion";
import { Briefcase, Users, Search, TrendingUp } from "lucide-react";
import Navbar from "../../containers/navbar";

const services = [
  {
    id: 1,
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    title: "Job Matching",
    description:
      "SmartHire connects job seekers with opportunities that align perfectly with their skills, experience, and ambitions.",
  },
  {
    id: 2,
    icon: <Users className="w-10 h-10 text-primary" />,
    title: "Talent Management",
    description:
      "Employers can efficiently manage applications, schedule interviews, and hire top talent through our platform.",
  },
  {
    id: 3,
    icon: <Search className="w-10 h-10 text-primary" />,
    title: "Smart Search",
    description:
      "Our AI-powered search makes it easy for recruiters and job seekers to quickly find the right fit.",
  },
  {
    id: 4,
    icon: <TrendingUp className="w-10 h-10 text-primary" />,
    title: "Career Growth",
    description:
      "We provide insights, analytics, and recommendations to help professionals grow in their careers.",
  },
];

export default function Services() {
  return (
    <>
    <Navbar/>
    <div className="bg-gray-50 min-h-screen py-20">
      {/* Hero Section */}
      <section className="relative  bg-primary text-white text-center py-30 rounded-b-4xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Our Services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-4 text-lg md:text-xl max-w-2xl mx-auto"
        >
          At SmartHire, we provide tools and services that make recruitment
          simple, transparent, and efficient for both job seekers and employers.
        </motion.p>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white text-center py-12 px-6 rounded-t-3xl">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl  font-bold mb-4"
        >
          Ready to experience SmartHire?
        </motion.h2>
        <div className="py-6"></div>
        <motion.a
          href="/signup"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-green-600 transition"
        >
          Get Started Today
        </motion.a>
      </section>
    </div>
    </>
  );
}
