import { FaFacebookF, FaInstagramSquare, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import NavBar from "../navbar";
import { motion } from "framer-motion";
import Footer from "../footer";

const Home = () => {
  return (
    <div className="relative">
      <NavBar />

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between px-6 py-10 pt-40 gap-8">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary">
              Find Your Dream Job Smarter
            </h1>
            <p className="text-lg md:text-xl font-semibold text-primary pt-4">
              We recommend opportunities that align with your career aspirations
            </p>
          </motion.div>
        </div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="md:w-1/2 flex justify-center"
        >
          <img
            src="landing.png"
            alt="Landing illustration"
            className="w-full max-w-md md:max-w-lg lg:max-w-xl object-contain"
          />
        </motion.div>
      </main>

      {/* How it Works Section */}
      <section className="bg-secondary rounded-tl-4xl rounded-br-4xl px-6 pt-16 pb-12 mb-20 relative">
        {/* Social Icons floating at the top edge */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex gap-4 flex-wrap z-10">
          <FaFacebookF size={24} className="text-primary hover:text-footerHead" />
          <FaYoutube size={24} className="text-primary hover:text-footerHead" />
          <FaInstagramSquare size={24} className="text-primary hover:text-footerHead" />
          <FaLinkedinIn size={24} className="text-primary hover:text-footerHead" />
          <RiTwitterXLine size={24} className="text-primary hover:text-footerHead" />
        </div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-10 pt-8">
          {/* Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 space-y-6"
          >
            <div>
              <h2 className="text-footerHead font-bold text-lg">How it</h2>
              <span className="text-white text-lg font-bold">Works?!</span>
            </div>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-3 items-start bg-white rounded-lg p-4 shadow-md">
                <span className="font-bold text-footerHead text-lg">01</span>
                <div>
                  <h3 className="font-bold text-lg text-secondary">Sign Up and Log In</h3>
                  <p className="text-gray-700 text-sm">
                    Either as an Employer, Employee, or Admin
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3 items-start bg-white rounded-lg p-4 shadow-md">
                <span className="font-bold text-footerHead text-lg">02</span>
                <div>
                  <h3 className="font-bold text-lg text-secondary">Connect & Discover Opportunities</h3>
                  <p className="text-gray-700 text-sm">
                    Job seekers get personalized job recommendations. Employers can post openings and instantly reach qualified candidates.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3 items-start bg-white rounded-lg p-4 shadow-md">
                <span className="font-bold text-footerHead text-lg">03</span>
                <div>
                  <h3 className="font-bold text-lg text-secondary">Apply, Hire and Grow</h3>
                  <p className="text-gray-700 text-sm">
                    Job seekers apply and track applications, while employers review applicants, schedule interviews, and build their teams—all in one place.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 flex justify-center mt-10 lg:mt-0"
          >
            <img
              src="hire.png"
              alt="Hire illustration"
              className="w-full max-w-sm md:max-w-md lg:max-w-lg object-contain"
            />
          </motion.div>
        </div>

        {/* Powered By Text */}
        <div className="text-center mt-8">
          <p className="text-white font-bold">Powered by SmartHire</p>
        </div>
      </section>

      {/* Floating Logo */}
      <div className="fixed bottom-10 right-10 w-16 h-16 z-50">
        <motion.img
          src="team_logo.png"
          className="w-full h-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
       <Footer />
    </div>
  );
};

export default Home;
