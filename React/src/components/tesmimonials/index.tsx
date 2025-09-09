import jobs from "../../assets/images/jobs.jpeg";
import img from "./../../assets/images/img_tes1 copy 4.jpeg";
import card from "../../assets/images/ReviewModals.png";
import slide1 from "../../assets/images/profile1.png";
import slide2 from "../../assets/images/ReviewModals.png";
import slide3 from "../../assets/images/profile2.png";
import slide4 from "../../assets/images/profile3.png";
import slide5 from "../../assets/images/profile4.png";
import slide6 from "../../assets/images/profile5.png";
import ImageSlider from "./ImageSlider";
import Faq from "../../assets/images/photo.png";
import Navbar from "../../containers/navbar";
import { motion } from "framer-motion";

const IMAGES = [slide1, slide2, slide3, slide4, slide5, slide6];

const Testimonials = () => {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section
        className="relative bg-center bg-cover h-full w-full py-60 rounded-b-4xl flex justify-center text-white flex-col items-center"
        style={{ backgroundImage: `url(${jobs})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 rounded-b-4xl bg-black/70 py-7"></div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col gap-4 items-center"
        >
          <h1 className="text-3xl text-center font-bold">
            Moving From Job Search to Dream Job
          </h1>
          <p className="text-white text-md font-medium text-center">
            Our users found new opportunities and career paths with our help. We
            are proud to be part of their success.
          </p>
        </motion.div>
      </section>

      <div className="overflow-hidden bg-gray-100 h-full w-full flex flex-col px-7 gap-9">
        {/* Career Story Section */}
        <motion.section
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white shadow-lg rounded-2xl mt-9 overflow-hidden flex flex-col md:flex-row"
        >
          <div className="flex-1 bg-green-400 p-8 flex flex-col justify-center">
            <h1 className="text-2xl md:text-5xl font-bold text-white leading-snug">
              Your Career, Your Story
            </h1>
            <p className="mt-4 font-bold text-sm text-white max-w-md">
              Our community of job seekers and employers is growing every day.
              Read how we've helped others navigate the job market and find
              fulfilling work. Your future starts here.
            </p>
          </div>
          <motion.img
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            src={img}
            alt="Person reading"
            className="rounded object-cover w-90 hidden sm:block lg:flex-1"
          />
        </motion.section>

        {/* Testimonial Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          {[1, 2, 3].map((i, idx) => (
            <motion.img
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              src={card}
              alt="profile"
              className="md:w-full h-auto object-cover rounded"
            />
          ))}
        </section>

        {/* Button */}
        <section className="flex align-center justify-center m-7 mb-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-1 border-white bg-primary rounded-md py-2 px-10 text-sm text-white font-bold hover:bg-white hover:text-primary hover:border-primary transition"
          >
            Read More comments
          </motion.button>
        </section>

        {/* Image Slider */}
        <section className="pb-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <ImageSlider imageURLs={IMAGES} />
          </motion.div>
        </section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-primary shadow-lg rounded-2xl mt-9 mb-9 overflow-hidden flex flex-col md:flex-row"
        >
          <div className="flex-1 px-6 lg:pl-20 py-15 font-semibold flex flex-col">
            <h1 className="text-2xl md:text-5xl font-bold text-white leading-snug">
              FQL
            </h1>
            {[
              "How do I create an account?",
              "Do I need to pay to apply for jobs?",
              "How do I improve my chances of getting hired?",
              "Can I apply to jobs without uploading a resume?",
              "How do I know if my application was successful?",
              "How do I set up job alerts?",
              "Can I edit or delete my profile after creating it?",
              "Are the jobs on this site verified?",
            ].map((faq, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="py-2 px-5 mt-4 text-sm text-white max-w-md border-t border-gray-500"
              >
                {idx + 1}. {faq}
              </motion.p>
            ))}
          </div>
          <motion.img
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            src={Faq}
            alt="FAQ"
            className="rounded object-cover w-90 hidden sm:block lg:flex-1"
          />
        </motion.section>
      </div>
    </>
  );
};

export default Testimonials;
