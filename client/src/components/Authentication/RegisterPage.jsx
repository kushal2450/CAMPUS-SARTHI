import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  logout,
  registerUser,
  resetState,
  selectAuthError,
  selectAuthLoading,
  selectAuthMessage,
  selectAuthSuccess,
} from "../../slices/authSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ✅ Import the new logo
import logo from "../../assets/logo.png";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const message = useSelector(selectAuthMessage);
  const isSuccess = useSelector(selectAuthSuccess);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  useEffect(() => {
    if (message) {
      toast.success(message); // Changed to toast.success based on your original toast logic
    }
  }, [isSuccess, message]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password, role }));
    dispatch(logout());
    navigate('/login');
    toast.success("Registration successful!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-indigo-50 font-sans">
      
      {/* ✅ Standardized Header/Navbar */}
      <nav className="bg-white px-8 py-3 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={logo} 
              alt="Campus Sarthi Logo" 
              className="h-10 w-auto group-hover:scale-105 transition transform"
            />
            <span className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition">Campus Sarthi</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition">
              Home
            </Link>
            <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 hover:shadow-lg transition transform">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Register Content */}
      <div className="flex-grow flex items-center justify-center p-6 sm:p-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-10 sm:p-12">
          <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
            Create an Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                autoFocus
                minLength={2}
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                pattern="^\S+@\S+\.\S+$"
                title="Enter a valid email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading}
                required
              >
                <option value="student">Student</option>
                <option value="company">Company</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && (
              <p className="text-red-600 text-sm mt-2 mb-1 text-center font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all transform hover:-translate-y-0.5 mt-4 ${
                isLoading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
              }`}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;