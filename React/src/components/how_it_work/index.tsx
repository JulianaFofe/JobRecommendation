import { motion } from "framer-motion";
import goal from "../../assets/images/goals.png";
import { Target, Briefcase, Users } from "lucide-react";
import Navbar from "../../containers/navbar";

export default function Goals() {
  const items = [
    {
      icon: <Target className="w-10 h-10 text-primary" />,
      title: "Our Goal",
      text: "SmartHire’s goal is to connect talent with opportunity seamlessly.",
    },
    {
      icon: <Briefcase className="w-10 h-10 text-primary" />,
      title: "For Employers",
      text: "Post jobs easily, review candidates, and hire the right fit faster.",
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "For Employees",
      text: "Discover job opportunities tailored to your skills and apply instantly.",
    },
  ];

  return (
    <div>
      <Navbar />
      {/* HERO SECTION */}
      <section className="bg-secondary relative rounded-4xl overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1  md:grid-cols-2 items-center px-6 py-16 md:py-24">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-4 py-10"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
              Welcome to SmartHire <br />
              <span className="text-white">
                where talent meets opportunity.
              </span>
            </h1>
            <p className="text-gray-700 md:text-lg max-w-md">
              We connect ambitious job seekers with forward-thinking employers.
              Our platform is built to simplify hiring and empower careers.
              Together, we shape the future of work, one connection at a time.
            </p>
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex justify-center md:justify-end"
          >
            <img
              src={goal}
              alt="SmartHire Hero"
              className="w-[80%] md:w-[70%]"
            /> 
          </motion.div>
        </div>
      </section>

      {/* GOALS SECTION */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-12"
          >
            SmartHire Goals & How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition"
              >
                <div className="mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
