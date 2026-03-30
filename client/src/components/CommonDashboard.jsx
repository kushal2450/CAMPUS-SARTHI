import { useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import { useNavigate, Link } from "react-router"; 
import { useEffect, useState } from "react"; // ✅ Added useState

import logo from '../assets/logo.png'; 

const CommonDashboard = () => {
  const user = useSelector(selectAuthUser);
  const navigate = useNavigate();
  
  // ✅ State to control the Help Modal
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    if (user) {
      console.log(user);
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  // Handle Query Submission
  const handleQuerySubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your query has been recorded. Our team will contact you shortly.");
    setIsHelpOpen(false); // Close modal after submitting
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">

      {/* Navbar */}
      <nav className="bg-white px-8 py-3 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={logo} 
              alt="Campus Sarthi Logo" 
              className="h-10 w-auto group-hover:scale-105 transition transform"
            />
            <span className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition"></span>
          </Link>

          <div className="flex items-center space-x-6">
            {/* ✅ Updated Home Link to point to the current root */}
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition">
              Home
            </Link>
            
            {/* ✅ Updated Help Button to open the Modal */}
            <button 
              onClick={() => setIsHelpOpen(true)} 
              className="text-slate-600 hover:text-indigo-600 font-medium transition cursor-pointer"
            >
              Help
            </button>
            
            <Link 
              to="/register" 
              className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 hover:shadow-lg transition transform"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 rounded-b-[3rem] shadow-xl relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg leading-tight">
            Welcome to Campus Sarthi
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform your academic journey with seamless placement tracking, student analytics, and campus management.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-indigo-600 rounded-full text-lg font-bold shadow-lg hover:bg-indigo-50 hover:scale-105 transition transform"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 border-2 border-white text-white rounded-full text-lg font-bold shadow-lg hover:bg-white hover:text-indigo-600 hover:scale-105 transition transform"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Stats Grid */}
      <div className="max-w-5xl mx-auto px-8 -mt-12 mb-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 border-l-4 border-indigo-500 hover:-translate-y-1 transition duration-300">
            <div className="text-indigo-500 text-4xl">🎓</div>
            <div>
              <h3 className="text-3xl font-extrabold text-slate-800">12+</h3>
              <p className="text-slate-500 font-semibold uppercase tracking-wider text-sm">Active Students</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 border-l-4 border-purple-500 hover:-translate-y-1 transition duration-300">
            <div className="text-purple-500 text-4xl">💼</div>
            <div>
              <h3 className="text-3xl font-extrabold text-slate-800">85%</h3>
              <p className="text-slate-500 font-semibold uppercase tracking-wider text-sm">Placement Rate</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 border-l-4 border-emerald-500 hover:-translate-y-1 transition duration-300">
            <div className="text-emerald-500 text-4xl">🏢</div>
            <div>
              <h3 className="text-3xl font-extrabold text-slate-800">15+</h3>
              <p className="text-slate-500 font-semibold uppercase tracking-wider text-sm">Recruiters</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">Campus Portal Features</h2>
          <p className="text-slate-500 mt-2 text-lg">Access powerful tools tailored for your placement success.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 flex items-start space-x-6 border border-slate-100 overflow-hidden">
            <div className="bg-indigo-100 text-indigo-600 p-4 rounded-xl text-2xl flex-shrink-0">📊</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Placement Analytics</h3>
              <p className="text-slate-600">Track placement progress, skill gaps, and get personalized company recommendations directly to your dashboard.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 flex items-start space-x-6 border border-slate-100 overflow-hidden">
            <div className="bg-purple-100 text-purple-600 p-4 rounded-xl text-2xl flex-shrink-0">🏢</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Company Portal</h3>
              <p className="text-slate-600">View all recruiting companies, check eligibility requirements, and apply to your dream job seamlessly.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 flex items-start space-x-6 border border-slate-100 overflow-hidden">
            <div className="bg-emerald-100 text-emerald-600 p-4 rounded-xl text-2xl flex-shrink-0">⏱️</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Student Dashboard</h3>
              <p className="text-slate-600">Access your personalized dashboard with quick actions, live application status tracking, and instant updates.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 flex items-start space-x-6 border border-slate-100 overflow-hidden">
            <div className="bg-orange-100 text-orange-600 p-4 rounded-xl text-2xl flex-shrink-0">📑</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Report Generation</h3>
              <p className="text-slate-600">Generate comprehensive analytics and detailed printable reports on student performance and achievements.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Full-Screen Help Section matching Login/Register styling */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-indigo-50 z-50 flex flex-col font-sans overflow-y-auto">
          
          {/* Navbar inside Help Screen */}
          <nav className="bg-white px-8 py-3 shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              
              {/* Clicking the logo returns to the dashboard */}
              <button onClick={() => setIsHelpOpen(false)} className="flex items-center space-x-3 group cursor-pointer border-none bg-transparent outline-none">
                <img 
                  src={logo} 
                  alt="Campus Sarthi Logo" 
                  className="h-10 w-auto group-hover:scale-105 transition transform"
                />
                <span className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition">Campus Sarthi</span>
              </button>

              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setIsHelpOpen(false)} 
                  className="text-slate-600 hover:text-indigo-600 font-medium transition cursor-pointer border-none bg-transparent outline-none"
                >
                  Home
                </button>
                <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 hover:shadow-lg transition transform">
                  Login
                </Link>
              </div>
            </div>
          </nav>

          {/* Main Help Content - Styled exactly like the Login Card */}
          <div className="flex-grow flex items-center justify-center p-6 sm:p-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-10 sm:p-12 relative">
              
              {/* Close Button */}
              <button 
                onClick={() => setIsHelpOpen(false)} 
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition outline-none"
              >
                ✕
              </button>

              <h2 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">Help & Support</h2>
              <p className="text-slate-500 mb-6 text-sm text-center font-medium">Reach out to us directly or submit a query below.</p>

              {/* Contact Info Box */}
              <div className="bg-indigo-50 rounded-xl p-4 mb-6 space-y-3 border border-indigo-100">
                <div className="flex items-center text-indigo-700 font-medium">
                  <span className="text-xl mr-3">📧</span> contact@pu2026.edu
                </div>
                <div className="flex items-center text-indigo-700 font-medium">
                  <span className="text-xl mr-3">📞</span> +91-9876543210
                </div>
              </div>

              {/* Query Recorder Form */}
              <form onSubmit={handleQuerySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" 
                    placeholder="student@pu2026.edu" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Query</label>
                  <textarea 
                    required 
                    rows="3" 
                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" 
                    placeholder="Describe your issue or ask a question..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Submit Query
                </button>
              </form>
              
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommonDashboard;