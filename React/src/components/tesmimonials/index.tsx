import React from 'react'
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

const IMAGES = [slide1,slide2,slide3,slide4,slide4,slide5,slide6]

const Testimonials = () => {
  return (
    <>
<section
  className="relative bg-center bg-cover h-full w-full py-15 flex justify-center text-white flex-col items-center"
  style={{ backgroundImage: `url(${jobs})` }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/70 py-7"></div>

  {/* Content */}
  <div className="relative z-10 flex flex-col gap-4 items-center">
    <h1 className="text-3xl text-center font-bold">
      Moving From Job Search to Dream Job
    </h1>
    <p className="text-white text-md font-medium text-center">
      Our users found new opportunities and career paths with our help. We are proud to be part of their success.
    </p>
  </div>
</section>

    <div className=' overflow-hidden bg-gray-100 h-full w-full flex flex-col px-7 gap-9'>
<section className="bg-white shadow-lg rounded-2xl mt-9 overflow-hidden flex flex-col md:flex-row">
  {/* Left side (Text content) */}
  <div className="flex-1 rounded bg-green-400 p-8 flex py-15 left-4  flex-col justify-center lg:flex-1">
    <h1 className=" z-1 text-2xl md:text-5xl font-bold text-white leading-snug">
      Your Career, Your Story

    </h1>
    <p className="z-1 mt-4 font-bold text-sm text-white max-w-md">
      Our community of job seekers and employers is growing every day.
       Read how we've helped others navigate the job market and find fulfilling work. Your future starts here.
    </p>
  </div>
  <img
    src={img}
    alt="Person reading"
    className="rounded object-cover w-90 hidden sm:block relative lg:flex-1"
  />
</section>
  <section className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
  <img src={card} alt="profile" className="md:w-full h-auto object-cover rounded" />
  <img src={card} alt="profile" className="md:w-full h-auto object-cover rounded" />
  <img src={card} alt="profile" className="md:w-full h-auto object-cover rounded" />
</section>

    <section className='flex align-center justify-center m-7 mb-0'>
        <button className='border-1 border-white hover:color-white hover:border-primary hover:border-1 hover:bg-white hover:text-primary bg-primary rounded-md py-2 px-10 text-sm text-white font-bold active:bg-primary active:text-white transition-color duration-300 ease-in-out'>
            Read More comments
        </button>
    </section>
    <section className='pb-10'>
      <ImageSlider imageURLs={IMAGES}/>
    </section>

    <section className="bg-primary shadow-lg rounded-2xl  mt-9 mb-9 overflow-hidden flex flex-col md:flex-row">
  {/* Left side (Text content) */}
  <div className="flex-1 rounded px-6 flex lg:pl-20 py-15 font-semibold  left-4  flex-col justify-top lg:flex-1">
    <h1 className=" z-1 text-2xl md:text-5xl font-bold text-white leading-snug">
      FQL

    </h1>
    <p className="z-1 py-2 px-5 mt-4 text-sm text-white max-w-md border-t-1 border-gray-500">
      1. How do I create an account?
    </p>
    <p className="z-1 py-2 px-5 mt-4 text-sm text-white max-w-md border-t-1 border-gray-500">
      2. Do I need to pay to apply for jobs?
    </p>
    <p className="z-1 py-2 px-5 mt-4 text-sm text-white max-w-md border-t-1 border-gray-500">
      3. How do I improve my chances of getting hired?
    </p>
    <p className="z-1 py-2 px-5 mt-4 text-sm text-white max-w-md border-t-1 border-gray-500">
      4. Can I apply to jobs without uploading a resume?
    </p>
    <p className="z-1 py-2 px-5 mt-4 text-sm text-white max-w-md border-t-1 border-gray-500">
      5. How do I know if my application was successful?
    </p>
    <p className="z-1 py-2 px-5 mt-4 text-sm text-white max-w-md border-t-1 border-gray-500">
      6. How do I set up job alerts?
    </p>
    <p className="z-1 py-2 px-5 mt-4 text-sm text-white max-w-md border-t-1 border-gray-500">
      7. Can I edit or delete my profile after creating it?
    </p>
    <p className="z-1 py-2 px-5 mt-4 text-sm text-white max-w-md border-t-1 border-gray-500">
      8. Are the jobs on this site verified?
    </p>
  </div>
  <img
    src={Faq}
    alt="Person reading"
    className="rounded object-cover w-90 hidden sm:block relative lg:flex-1"
  />
</section>
    </div>
    </>
  )
}

export default Testimonials