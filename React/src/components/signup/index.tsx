import { useState } from "react";
import logo from "../../assets/icons/logo1.png";
import eye from "../../assets/icons/eye.svg";
import closed_eye from "../../assets/icons/close_eye.svg";
import mail from "../../assets/icons/envelope-1.svg";
import username from "../../assets/icons/username.svg";
import { Link } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        
        {/* Left Section */}
        <div className="md:w-1/2 bg-quatenary text-white flex flex-col items-center justify-center p-10 text-center">
          <img src={logo} alt="SmartHire Logo" className="w-28 mb-6" />
          <h2 className="text-2xl font-bold my-3 mb-5">Your Career, Your Way</h2>
          <p className="mt-3 text-sm">
            Create Your account, unlock opportunities and start your journey with us today!
          </p>
          <Link to="/login"> 
          <button className="mt-11 bg-white text-quatenary px-14 font-bold py-2 rounded-xl shadow hover:bg-primary hover:text-white active:opacity-50 transition-bg duratiom-700 active:opacity-50">
            Login 
          </button>
          </Link> 
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 flex flex-col justify-center items-center p-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-500">Create Account</h2>

          {/* Username */}
          <div className="flex items-center w-full max-w-sm border-none bg-gray-50 rounded-md px-3 py-2 mb-4 focus-within:ring-1 focus-within:ring-quatenary">
            <img src={username} alt="username icon" className="w-5 h-5 mr-2 opacity-50" />
            <input
              type="text"
              placeholder="Username"
              className="flex-1 outline-none bg-transparent"
            />
          </div>

          {/* Email */}
          <div className="flex items-center w-full max-w-sm border-none bg-gray-50 rounded-md px-3 py-2 mb-4 focus-within:ring-1 focus-within:ring-quatenary">
            <img src={mail} alt="email icon" className="w-5 h-5 mr-2 opacity-50" />
            <input
              type="email"
              placeholder="Email"
              className="flex-1 outline-none bg-transparent"
            />
          </div>

          {/* Password */}
          <div className="flex items-center w-full max-w-sm border-none bg-gray-50 rounded-md px-3 py-2 mb-6 focus-within:ring-1 focus-within:ring-quatenary">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="flex-1 outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={showPassword ? closed_eye : eye}
                alt="toggle visibility"
                className="w-5 h-5 opacity-50"
              />
            </button>
          </div>

          {/* Sign Up Button */}
          <button className=" hover:opacity-75 border-1 border-white hover:text-primary hover:bg-white hover:border-primary active:text-primary active:border-primary active:bg-green-100 font-bold bg-primary text-white px-14 py-2 rounded-xl  transition">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
