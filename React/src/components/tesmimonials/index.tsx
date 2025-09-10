import jobs from "../../assets/images/jobs.jpeg"
import img from './../../assets/images/img_tes1 copy 4.jpeg'
import card from "../../assets/images/ReviewModals.png"
import slide1 from "../../assets/images/profile1.png"
import slide2 from "../../assets/images/ReviewModals.png"
import slide3 from "../../assets/images/profile2.png"
import slide4 from "../../assets/images/profile3.png"
import slide5 from "../../assets/images/profile4.png"
import slide6 from "../../assets/images/profile5.png"
import ImageSlider from './ImageSlider'
import Faq from "../../assets/images/photo.png"
import Navbar from "../../containers/navbar"
import { useState } from "react"

const IMAGES = [slide1,slide2,slide3,slide4,slide4,slide5,slide6]

// FAQ data
const FAQS = [
  {
    q: "1. How do I create an account?",
    a: "Go to the signup page, fill in your details, and follow the instructions to create your account."
  },
  {
    q: "2. Do I need to pay to apply for jobs?",
    a: "No, applying for jobs is completely free on our platform."
  },
  {
    q: "3. How do I improve my chances of getting hired?",
    a: "Make sure your profile is complete, upload a professional resume, and apply to jobs that match your skills."
  },
  {
    q: "4. Can I apply to jobs without uploading a resume?",
    a: "Some employers may allow it, but we recommend uploading a resume for better chances."
  },
  {
    q: "5. How do I know if my application was successful?",
    a: "You will receive a confirmation email and can track your application status in your dashboard."
  },
  {
    q: "6. How do I set up job alerts?",
    a: "Go to your settings and enable job alerts to get notified about new opportunities."
  },
  {
    q: "7. Can I edit or delete my profile after creating it?",
    a: "Yes, you can always edit or delete your profile from the account settings page."
  },
  {
    q: "8. Are the jobs on this site verified?",
    a: "Yes, all jobs are reviewed and verified before being published on the site."
  },
]

const Testimonials = () => {
  const [openIndex, setOpenIndex] = useState(null) // track which question is open

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index) // close if already open, otherwise open new
  }

  return (
    <>
      <Navbar/>

      {/* Hero section */}
      <section
        className="relative bg-center bg-cover h-full w-full py-60 rounded-4xl flex justify-center text-white flex-col items-center"
        style={{ backgroundImage: `url(${jobs})` }}
      >
        <div className="absolute inset-0 rounded-4xl bg-black/70 py-7"></div>
        <div className="relative z-10 flex flex-col gap-4 items-center">
          <h1 className="text-3xl text-center font-bold">
            Moving From Job Search to Dream Job
          </h1>
          <p className="text-white text-md font-medium text-center">
            Our users found new opportunities and career paths with our help. We are proud to be part of their success.
          </p>
        </div>
      </section>

      <div className='overflow-hidden bg-gray-100 h-full w-full flex flex-col px-7 gap-9'>

        {/* Career Story Section */}
        <section className="bg-white shadow-lg rounded-2xl mt-9 overflow-hidden flex flex-col md:flex-row">
          <div className="flex-1 bg-green-400 p-8 flex py-15 flex-col justify-center">
            <h1 className="text-2xl md:text-5xl font-bold text-white leading-snug">
              Your Career, Your Story
            </h1>
            <p className="mt-4 font-bold text-sm text-white max-w-md">
              Our community of job seekers and employers is growing every day.
              Read how we've helped others navigate the job market and find fulfilling work. Your future starts here.
            </p>
          </div>
          <img src={img} alt="Person reading" className="rounded object-cover w-90 hidden sm:block lg:flex-1" />
        </section>

        {/* Review cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          <img src={card} alt="profile" className="md:w-full h-auto object-cover rounded" />
          <img src={card} alt="profile" className="md:w-full h-auto object-cover rounded" />
          <img src={card} alt="profile" className="md:w-full h-auto object-cover rounded" />
        </section>

        {/* Button */}
        <section className='flex justify-center m-7 mb-0'>
          <button className='border border-white hover:bg-white hover:text-primary bg-primary rounded-md py-2 px-10 text-sm text-white font-bold transition duration-300 ease-in-out'>
            Read More comments
          </button>
        </section>

        {/* Image Slider */}
        <section className='pb-10'>
          <ImageSlider imageURLs={IMAGES}/>
        </section>

        {/* FAQ Section */}
        <section className="bg-secondary shadow-lg rounded-2xl mt-9 mb-9 overflow-hidden flex flex-col md:flex-row">
          <div className="flex-1 px-6 py-15 lg:pl-20 flex flex-col gap-2">
            <h1 className="text-2xl md:text-5xl font-bold text-white leading-snug mb-4">
              FAQ
            </h1>

            {FAQS.map((faq, index) => (
              <div key={index}>
                <p
                  className="py-2 px-5 mt-4 text-sm text-white max-w-md border-t border-white font-medium cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.q}
                </p>
                {openIndex === index && (
                  <p className="py-2 px-5 text-sm text-white max-w-md">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          <img src={Faq} alt="faq" className="rounded object-cover w-90 hidden sm:block lg:flex-1" />
        </section>
      </div>
    </>
  )
}

export default Testimonials
