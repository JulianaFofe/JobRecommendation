import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/icons/logo1.png";
import eye from "../../assets/icons/eye.svg";
import closed_eye from "../../assets/icons/close_eye.svg";
import mail from "../../assets/icons/envelope-1.svg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const [error, setError] = useState("");     
  const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/users/login", {
        email,
        password,
      });

      const { access_token, role, message } = response.data;

      // Save JWT in localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", role);

      // Show success message
      setMessage(message);

      // Redirect immediately based on role
      if (role === "admin") navigate("/dashview");
      else if (role === "employer") navigate("/employer");
      else navigate("/employeedash");

      // Clear input fields
      setEmail("");
      setPassword("");

    } catch (err: any) {
      if (err.response && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Login failed. Check your credentials.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-4">
      <div className="bg-white shadow-lg rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">

        {/* Left Section */}
        <div className="md:w-1/2 flex flex-col justify-center items-center p-8">
          <h2 className="text-2xl font-semibold mb-4 pb-12 text-gray-500">Login</h2>

          {message && <p className="text-green-500 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex items-center w-full max-w-sm bg-gray-50 rounded-md px-3 py-2 mb-4 focus-within:ring-1 focus-within:ring-quatenary">
            <img src={mail} alt="email icon" className="w-5 h-5 mr-2 opacity-50" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center w-full max-w-sm bg-gray-50 rounded-md px-3 pt-2 focus-within:ring-1 focus-within:ring-quatenary">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none bg-transparent"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              <img
                src={showPassword ? closed_eye : eye}
                alt="toggle visibility"
                className="w-5 h-5 opacity-50"
              />
            </button>
          </div>
          <p className="mb-5 font-light text-sm p-1 hover:text-primary cursor-pointer text-gray-500">password forgitten?</p>

          <button
            onClick={handleLogin}
            className="hover:opacity-75 border-1 border-white hover:text-primary hover:bg-white hover:border-primary active:text-primary active:border-primary active:bg-green-100 font-bold bg-primary text-white px-14 py-2 rounded-xl transition"
          >
            Login
          </button>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 bg-quatenary text-white flex flex-col items-center justify-center p-10 text-center">
          <img src={logo} alt="SmartHire Logo" className="w-28 mb-6" />
          <h2 className="text-2xl font-bold my-5 mb-5">WELCOME BACK</h2>
          <p className="mt-3 text-sm">
            To keep connected with us please login with your personal info
          </p>
          <Link to={"/signup"}>
            <button className="mt-6 bg-white text-quatenary px-14 font-bold py-2 rounded-xl shadow hover:bg-primary hover:text-white active:opacity-50 transition-bg duration-700">
              Sign-up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
