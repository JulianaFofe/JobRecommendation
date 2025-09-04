import React from "react";
import { Menu, User, AppWindow, Briefcase, Send } from "lucide-react";
import m from "../../assets/images/img.png?url";

function Employer() {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 mt-10">
        {/* Sidebar */}
        <div className="shadow-[1px_1px_2px_2px] p-6 lg:h-screen shadow-slate-300 mx-6 mt-2 rounded-md">
          <div className="flex justify-center items-center mb-6">
            <img
              src={m}
              alt=""
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          <h1 className="text-[#34A853] text-center font-bold text-2xl">
            Post Jobs
          </h1>
          <span className="flex gap-4 mt-5 bg-[#BEF9CE] p-2 rounded-md items-center">
            <Send
              color="green"
              className="w-10 sm:w-12 md:w-14 lg:w-16 object-contain"
            />
            Post
          </span>
          <span className="flex gap-4 mt-5 items-center">
            <Briefcase
              color="green"
              className="w-10 sm:w-12 md:w-14 lg:w-16 object-contain"
            />
            My Jobs
          </span>
          <span className="flex gap-4 mt-5 items-center">
            <AppWindow
              color="green"
              className="w-10 sm:w-12 md:w-14 lg:w-16 object-contain"
            />
            Applications
          </span>
          <span className="flex gap-4 mt-5 items-center">
            <User
              color="green"
              className="w-10 sm:w-12 md:w-14 lg:w-16 object-contain"
            />
            Profile
          </span>
          <span className="flex gap-4 mt-7 items-center">
            <Menu
              color="green"
              className="w-10 sm:w-12 md:w-14 lg:w-16 object-contain "
            />
            Settings
          </span>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <span className="text-green-500 hover:text-[#FFC107] transition duration-300 cursor-pointer font-bold">
              Post Jobs
            </span>
            <ul className="flex flex-wrap gap-4 sm:gap-10">
              <li className="text-green-500 hover:text-[#FFC107] transition duration-300 cursor-pointer font-bold">
                Applications
              </li>
              <li className="text-green-500 hover:text-[#FFC107] transition duration-300 cursor-pointer font-bold">
                Profile
              </li>
              <li className="text-green-500 hover:text-[#FFC107] transition duration-300 cursor-pointer font-bold">
                Settings
              </li>
            </ul>
          </div>

          <h1 className="mt-10 mb-3 font-sans font-bold text-xl">
            Job Postings
          </h1>
          <div>
            <div className="shadow-[1px_1px_2px_2px] p-6 shadow-slate-300 rounded-md">
              <div className="flex justify-between mt-10 mb-6">
                <h1 className="font-sans font-semibold">Title</h1>
                <h1 className="font-sans font-semibold">Applicant</h1>
                <h1 className="font-sans font-semibold">Status</h1>
              </div>
              <hr className="w-full border-[#FFC107] mb-6" />
              <div className="flex justify-between">
                <div className="rounded-md border w-24 p-2 bg-slate-200"></div>
                <div className="rounded-md border w-32 p-2 bg-slate-200"></div>
                <div className="rounded-md border w-24 p-2 bg-slate-200"></div>
              </div>
              <hr className="w-full border-[#FFC107] mt-12" />
              <div className="flex justify-between mt-10">
                <div className="rounded-md border w-20 p-2 bg-slate-200"></div>
                <div className="rounded-md border w-20 p-2 bg-slate-200"></div>
                <div className="rounded-md border w-20 p-2 bg-slate-200"></div>
              </div>
            </div>

            <div>
              <h1 className="pt-5 font-sans font-bold">View Applicants</h1>
              <div className="shadow-[1px_1px_2px_2px] shadow-slate-300 p-6 mt-5 rounded-md">
                <div className="flex flex-wrap justify-between items-center gap-4 mt-10">
                  <p>Simon B</p>
                  <div className="rounded-md border w-20 p-2 bg-slate-200"></div>
                  <div className="rounded-md border w-20 p-2 bg-slate-200"></div>
                  <div className="rounded-md border w-20 p-2 bg-slate-200"></div>
                  <span className=" cursor-pointer">View Resume</span>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-4 mt-10">
                  <p>Caro B</p>
                  <div className="rounded-md border w-20 p-2 bg-slate-200"></div>
                  <div className="rounded-md border w-20 p-2 bg-slate-200"></div>
                  <div className="rounded-md border w-20 p-2 bg-slate-200"></div>
                  <span className=" cursor-pointer">View Resume</span>
                </div>
              </div>
              <div className="shadow-[1px_1px_2px_2px] p-6 flex flex-wrap justify-between items-center gap-4 mt-10 shadow-slate-300 mb-10 rounded-md">
                <p>Carine M</p>
                <div className="rounded-md border w-20 p-2 bg-slate-200"></div>
                <div className="rounded-md border w-20 p-2 bg-slate-200"></div>
                <div className="rounded-md border w-20 p-2 bg-slate-200"></div>
                <span className=" cursor-pointer">View Resume</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Employer;
