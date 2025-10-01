import jobs from "../../assets/images/jobs.jpeg"
import img from './../../assets/images/img_tes1 copy 4.jpeg'
import card1 from "../../assets/images/Review Modals (1).png"
import card2 from "../../assets/images/Review Modals (2).png"
import card3 from "../../assets/images/Review Modals.png"
import slide1 from "../../assets/images/profile1.png"
import slide2 from "../../assets/images/ReviewModals.png"
import slide3 from "../../assets/images/profile2.png"
import slide4 from "../../assets/images/profile3.png"
import slide5 from "../../assets/images/profile4.png"
import slide6 from "../../assets/images/profile5.png"
import ImageSlider from './ImageSlider'
import Faq from "../../assets/images/photo.jpg"
import Navbar from "../../containers/navbar"
import { useState } from "react"
import { motion } from "framer-motion"
import Footer from "../../containers/footer"

const IMAGES = [slide1, slide2, slide3, slide4, slide5, slide6]

// FAQ data
const FAQS = [
  { q: "1. How do I create an account?", a: "Go to the signup page, fill in your details, and follow the instructions to create your account." },
  { q: "2. Do I need to pay to apply for jobs?", a: "No, applying for jobs is completely free on our platform." },
  { q: "3. How do I improve my chances of getting hired?", a: "Make sure your profile is complete, upload a professional resume, and apply to jobs that match your skills." },
  { q: "4. Can I apply to jobs without uploading a resume?", a: "Some employers may allow it, but we recommend uploading a resume for better chances." },
  { q: "5. How do I know if my application was successful?", a: "You will receive a confirmation email and can track your application status in your dashboard." },
  { q: "6. How do I set up job alerts?", a: "Go to your settings and enable job alerts to get notified about new opportunities." },
  { q: "7. Can I edit or delete my profile after creating it?", a: "Yes, you can always edit or delete your profile from the account settings page." },
  { q: "8. Are the jobs on this site verified?", a: "Yes, all jobs are reviewed and verified before being published on the site." },
]

const Testimonials = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative bg-center bg-cover min-h-[60vh] w-full flex justify-center items-center text-white"
        style={{ backgroundImage: `url(${jobs})` }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 px-4 text-center max-w-3xl">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
            Moving From Job Search to Dream Job
          </h1>
          <p className="text-sm md:text-base lg:text-lg font-medium">
            Our users found new opportunities and career paths with our help. We are proud to be part of their success.
          </p>
        </div>
      </motion.section>

      <div className="bg-gray-100 w-full flex flex-col px-4 sm:px-6 lg:px-12 gap-9">

        {/* Career Story Section */}
        <motion.section
          className="bg-white shadow-lg rounded-2xl mt-9 overflow-hidden flex flex-col md:flex-row"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex-1 bg-green-400 p-6 sm:p-10 flex flex-col justify-center text-center md:text-left">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-snug">
              Your Career, Your Story
            </h1>
            <p className="mt-4 font-medium text-sm md:text-base text-white max-w-md mx-auto md:mx-0">
              Our community of job seekers and employers is growing every day.
              Read how we've helped others navigate the job market and find fulfilling work. Your future starts here.
            </p>
          </div>
          <img src={img} alt="Person reading" className="w-full md:w-1/2 h-64 md:h-auto object-cover" />
        </motion.section>

        {/* Review cards */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 items-center gap-4"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
          }}
          viewport={{ once: true }}
        >
          {[card1, card2, card3].map((card, i) => (
            <motion.img
              key={i}
              src={card}
              alt="profile"
              className="md:w-full h-auto object-cover rounded"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8 }}
            />
          ))}
        </motion.section>

        {/* Button */}
        <motion.section
          className="flex justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <button className="border border-primary hover:bg-primary hover:text-white bg-white text-primary rounded-md py-2 px-8 text-sm md:text-base font-bold transition duration-300 ease-in-out">
            Read More Comments
          </button>
        </motion.section>

        {/* Image Slider */}
        <motion.section
          className="pb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <ImageSlider imageURLs={IMAGES} />
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          className="bg-secondary shadow-lg rounded-2xl mt-9 mb-9 overflow-hidden flex flex-col md:flex-row"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex-1 px-6 py-10 lg:pl-16 flex flex-col gap-2">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              FAQ
            </h1>

            {FAQS.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: openIndex === index ? 1 : 0.8 }}
                transition={{ duration: 0.4 }}
              >
                <p
                  className="py-2 px-3 text-sm md:text-base text-white border-t border-white font-medium cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.q}
                </p>
                {openIndex === index && (
                  <p className="py-2 px-3 text-xs md:text-sm text-white max-w-md">
                    {faq.a}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <img src={Faq} alt="faq" className="hidden md:block lg:flex-1 object-cover w-full md:w-1/2 h-64 md:h-auto" />
        </motion.section>
      </div>
      <Footer />
    </>
  )
}

export default Testimonials
