import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaFacebookF, FaInstagramSquare, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { IoIosChatboxes } from "react-icons/io";
import Navbar from "../../containers/navbar";

const Footer = () => {
  return (
    <>
    <Navbar/>
    <footer className="bg-primary text-white px-6 py-10 relative rounded-tl-4xl rounded-tr-4xl">
      {/* Top section */}
      <div className="flex flex-col lg:flex-row lg:justify-between items-start gap-10 lg:gap-20">
        
        {/* About / Logo */}
        <div className="flex-1 text-center lg:text-left">
          <div className="bg-white w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center shadow-md mx-auto lg:mx-0 mb-4">
            <img
              src="team_logo.png"
              alt="team logo"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-inter text-sm md:text-base">
            Smart Hire is an innovative career technology platform supported by
            leading recruitment experts, and AI driven analytics helping job
            seekers find opportunities that match their skills and ambitions.
          </p>
        </div>

        {/* Links Sections */}
        <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-10 w-full">
          <div className="flex-1 text-center sm:text-left mb-6 sm:mb-0">
            <h3 className="text-footerHead font-lalezar mb-3">Company</h3>
            <div className="flex flex-col gap-1">
              <a href="" className="hover:underline hover:text-secondary">About Us</a>
              <a href="/service" className="hover:underline hover:text-secondary">Services</a>
              <a href="" className="hover:underline hover:text-secondary">Community</a>
              <a href="/stories" className="hover:underline hover:text-secondary">Testimonials</a>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left mb-6 sm:mb-0">
            <h3 className="text-footerHead font-lalezar mb-3">Support</h3>
            <div className="flex flex-col gap-1">
              <a href="" className="hover:underline hover:text-secondary">Help Center</a>
              <a href="" className="hover:underline hover:text-secondary">Tweet @Us</a>
              <a href="" className="hover:underline hover:text-secondary">Web</a>
              <a href="/feedback" className="hover:underline hover:text-secondary">Feedback</a>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-footerHead font-lalezar mb-3">Links</h3>
            <div className="flex flex-col gap-1">
              <a href="" className="hover:underline hover:text-secondary">Courses</a>
              <a href="" className="hover:underline hover:text-secondary">Employers</a>
              <a href="/service" className="hover:underline hover:text-secondary">Services</a>
              <a href="" className="hover:underline hover:text-secondary">All In One</a>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="flex-1 text-center lg:text-left mt-8 lg:mt-0">
          <h3 className="text-footerHead font-lalezar mb-3">Contact Us</h3>
          <div className="flex justify-center lg:justify-start items-center gap-2 mb-2">
            <IoCall size={20} className="text-secondary" />
            <p className="font-inter">(+237) 673 863 454</p>
          </div>
          <div className="flex justify-center lg:justify-start items-center gap-2">
            <MdEmail size={20} className="text-secondary" />
            <p className="font-inter">support@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="mt-10 flex justify-center gap-6 flex-wrap">
        <FaFacebookF size={22} className="text-secondary hover:text-white" />
        <FaYoutube size={22} className="text-secondary hover:text-white" />
        <FaInstagramSquare size={22} className="text-secondary hover:text-white" />
        <FaLinkedinIn size={22} className="text-secondary hover:text-white" />
        <RiTwitterXLine size={22} className="text-secondary hover:text-white" />
      </div>

      {/* Powered By Text */}
      <p className="mt-4 text-center text-white font-bold text-lg">
        Powered By SmartHire
      </p>

      {/* Bottom Section */}
      <div className="mt-8 flex flex-col md:flex-row md:justify-between items-center gap-4 text-sm border-t border-white pt-4">
        <p>
          <span className="text-secondary">&copy;</span> SmartHire All Rights Reserved
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="" className="hover:underline hover:text-secondary">Privacy Policy</a>
          <a href="" className="hover:underline hover:text-secondary">Terms of Use</a>
          <a href="" className="hover:underline hover:text-secondary">Log Out</a>
          <a href="" className="hover:underline hover:text-secondary">Site Map</a>
        </div>
      </div>

      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6 z-50 cursor-pointer">
        <IoIosChatboxes size={40} className="text-secondary hover:text-primary shadow-lg rounded-full bg-primary p-2 hover:bg-secondary transition" />
      </div>
    </footer>
    </>
  );
};

export default Footer;
