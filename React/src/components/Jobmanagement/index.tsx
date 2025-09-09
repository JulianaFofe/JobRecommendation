import n from "../../assets/images/img.png";
import { Briefcase } from "lucide-react";
import { LineChart } from "lucide-react";
import { User } from "lucide-react";
import { List } from "lucide-react";
import { Plus } from "lucide-react";
import { Calendar } from "lucide-react";
import { Menu } from "lucide-react";
import { Filter } from "lucide-react";
import { Eye } from "lucide-react";
import { NotebookPen } from "lucide-react";




const Job = () => {
  return (
    <div className="mb-10 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pl-6 sm:pl-10 shadow-lg shadow-slate-500">
        <div className="flex">
          <div className="">
            <img src={n} alt="" className="w-20 sm:w-30" />
            <span className="pl-2 sm:pl-5">Admin Portal</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-80 ">
          <div className="">
            <span className="text-primary font-bold">Job Management </span>
            <br />
            <span className="text-sm sm:text-base">
              Manage all job posting on your platform
            </span>
          </div>
          <div>
            <button className="bg-secondary mt-2 sm:mt-3  flex items-center rounded m-4 p-2 ">
              <Plus color="green" />
              <span className="ml-1">Add Job</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div className="shadow-lg shadow-slate-500 p-6 w-full lg:w-1/3">
          <p>QUICK</p>
          <div className="mt-5">
            <span className="flex mt-6 text-sm gap-2">
              <LineChart color="green" /> Dashboard Overview
            </span>
            <span className="flex mt-6 gap-2">
              <Briefcase color="green" /> Job Management
            </span>
            <span className="flex mt-6 gap-2">
              <User color="green" /> User Management
            </span>
            <span className="flex mt-6 gap-2">
              <List color="green" /> User Management
            </span>
          </div>
          <div>
            <h1 className="text-gray-500 mt-10">QUICK ACTION</h1>
            <span className="flex mt-6 gap-2 mb-3 ">
              <Plus color="green" /> Add New Job
            </span>
            <span className="flex mt-6 gap-2">
              <Calendar color="green" /> Schedule Report
            </span>
            <span className="flex mt-6 gap-2">
              <Menu color="green" /> Schedule Report
            </span>
          </div>
        </div>

        <div className="w-full lg:w-2/3">
          <div className="shadow-md shadow-slate-500 pl-2 pb-7 rounded mt-1">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 pr-4">
              <h1 className="text-primary font-bold pl-4">
                Recent Job Posting
              </h1>
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  className="border rounded px-2 w-full sm:w-auto"
                  type="text"
                  placeholder="search jobs..."
                />
                <Filter color="green" className="border rounded" />
              </div>
            </div>

            <div className="flex flex-col gap-6 pr-4 sm:pr-10">
              {[1, 2, 3, 4].map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md shadow-slate-400 ml-4 sm:ml-7 p-4 sm:p-7 rounded mt-4"
                >
                  <div>
                    <h1>Job Title</h1>
                    <p>Company/institution Name</p>
                    <span>Active</span>21 applicants <p>3 days ago</p>
                  </div>
                  <div className="flex gap-3">
                    <Eye color="yellow" />
                    <NotebookPen />
                    ------
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Job;
