
import {BriefcaseBusiness,Globe, Award, TrendingUp} from "lucide-react"
import Navbar from '../../containers/navbar'

const About = () => {
  return (
    <>
    <div>
      <Navbar/>
      <div className='h-full w-full py-20 text-white flex flex-col justify-center align-center items-align insert-none bg-gray-50 '>
      <section className='mb-20 px-12 py-26 flex shadow rounded-bl rounded-br  flex-col justify-center gap-2 align-center items-center bg-primary '>
        <p className='font-bold text-4xl text-center'>About US</p>
        <p className='text-md font-normal text-center'>We connect ambitious professionals with top employers worldwide, creating a bridge between talent and opportunity across industries and borders. Our platform is designed to help job seekers showcase their skills, discover roles that match their career goals.</p>
      </section>
      
      <div className='flex flex-col'>
      <section className=' m-4 gap-4 px-12 grid grid-rows-4 grid-cols-1 md:grid-rows-2 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-1 '>

        <div className='transition-transform duration-1000 bg-white hover:scale-110 flex rounded-md p-5 py-12 shadow-md flex-col   cursor-pointer text-primary justify-center items-center  align-center'>
          <TrendingUp className="font-bold w-12 h-12" />
          <p className='p-4 text-gray-700 font-bold text-1xl text-center'>Find Your Dream Job</p>
          <p className='text-gray-600 text-center font-light'>Browse thousands of verified listings across industries.</p>
        </div>

        <div className='transition-transform duration-1000 bg-white hover:scale-110 flex rounded-md p-5 py-12 shadow-md flex-col   cursor-pointer text-primary justify-center items-center  align-center'>
          <Award className="font-bold w-12 h-12" />
          <p className='p-4 text-gray-700 font-bold text-1xl text-center'>Talent Highlighting</p>
          <p className='text-gray-600 text-center font-light'>Showcase your skills with a professional profile.</p>
        </div>

        <div className='transition-transform duration-1000 bg-white hover:scale-110 flex rounded-md p-5 py-12 shadow-md flex-col  cursor-pointer text-primary justify-center items-center  align-center'>
          <BriefcaseBusiness className="font-bold w-12 h-12" />
          <p className='p-4 text-gray-700 font-bold text-1xl text-center'>Post a Job</p>
          <p className='text-gray-600 text-center font-light'> Post openings and manage applications on our platform.</p>
        </div>

        <div className='transition-transform duration-1000 bg-white hover:scale-110 flex rounded-md p-5 py-12 shadow-md flex-col   cursor-pointer text-primary justify-center items-center  align-center'>
          <Globe className="font-bold w-12 h-12" />
          <p className='p-4 text-gray-700 font-bold text-1xl text-center'>Global Opportunities</p>
          <p className='text-gray-600 text-center font-light'>Browse thousands of verified listings across industries.</p>
        </div>

      </section>

      <section className=' mt-20 px-12 py-26  flex shadow rounded-tl rounded-tr  flex-col justify-center gap-2 align-center items-center bg-secondary '>
        <p className='font-bold text-4xl text-center'>Our Core Values</p>
        <p className='text-lg font-normal text-center'> Our platform is built on three core values: Integrity, Empowerment, and Innovation. We're dedicated to transparency by verifying every job and securing your data. We give you the tools to take control of your career or build your team, and we're always improving to make the process easier for everyone.</p>

        <button className='mt-17 bg-primary px-10 py-3 font-semibold text-md border-none transform transition-all  ease-in  rounded border-1 hover:text-primary hover:bg-white active:bg-primary active:text-white    '>Get Started Today</button>

      </section>
      </div>
      </div>
    </div>
    </>
  )
}

export default About