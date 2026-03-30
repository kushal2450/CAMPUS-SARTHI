import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthUser, logout } from "../slices/authSlice"; 
import { useNavigate } from "react-router";
import { RxHamburgerMenu } from "react-icons/rx";

// ✅ Import your new logo
import logo from "../assets/logo.png";

const Navbar = () => {
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isStudent = user?.role === "student";
  const isCompany = user?.role === "company";
  const isAdmin = user?.role === "admin";

  const handleViewProfileClick = () => {
    if (isStudent) {
      navigate(`/student/viewStudentProfile`);
    } else if (isCompany) {
      navigate(`/company/profile/${user._id}`);
    }
    setMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Navigation links data for admin
  const adminLinks = [
    { name: "Report", path: "/admin/reports" },
    { name: "Placement Drive", path: "/admin/placementDrive" },
    { name: "Student Management", path: "/admin/student/profiles" },
  ];

  return (
    <nav className="bg-white px-6 py-3 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Modern Logo Area */}
        <div
          className="flex items-center space-x-3 group cursor-pointer"
          onClick={() => {
            navigate("/");
            setMenuOpen(false);
          }}
        >
          <img 
            src={logo} 
            alt="Campus Sarthi Logo" 
            className="h-10 w-auto group-hover:scale-105 transition transform"
          />
          <span className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition hidden sm:block">
            Campus Sarthi
          </span>
        </div>

        {/* Hamburger Icon shown on small screens */}
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-slate-800 text-3xl focus:outline-none hover:text-indigo-600 transition"
            aria-label="Toggle menu"
          >
            <RxHamburgerMenu />
          </button>
        </div>

        {/* Navigation links for medium & up */}
        <div className="hidden sm:flex sm:items-center sm:space-x-6 text-slate-600 font-medium">
          {isAdmin &&
            adminLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className="hover:text-indigo-600 transition"
              >
                {link.name}
              </button>
            ))}

          {isCompany && (
            <>
              <button
                onClick={() => navigate("/companydashboard")}
                className="hover:text-indigo-600 transition"
              >
                Dashboard
              </button>
              <button onClick={handleViewProfileClick} className="hover:text-indigo-600 transition">
                View Profile
              </button>
            </>
          )}

          {isStudent && (
            <>
              <button
                onClick={() => navigate("/studentdashboard")}
                className="hover:text-indigo-600 transition"
              >
                Dashboard
              </button>
              <button onClick={handleViewProfileClick} className="hover:text-indigo-600 transition">
                View Profile
              </button>
            </>
          )}

          {/* Solid Red Logout Button */}
          <button 
            onClick={handleLogout} 
            className="px-6 py-2 bg-red-50 text-red-600 rounded-full font-semibold hover:bg-red-600 hover:text-white transition transform"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu - shown when hamburger is toggled */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-4 top-16 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 sm:hidden overflow-hidden"
          >
            <div className="flex flex-col text-slate-600 font-medium">
              {isAdmin &&
                adminLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      navigate(link.path);
                      setMenuOpen(false);
                    }}
                    className="text-left px-6 py-4 hover:bg-indigo-50 hover:text-indigo-600 border-b border-gray-50 transition"
                  >
                    {link.name}
                  </button>
                ))}

              {isCompany && (
                <>
                  <button
                    onClick={() => {
                      navigate("/companydashboard");
                      setMenuOpen(false);
                    }}
                    className="text-left px-6 py-4 hover:bg-indigo-50 hover:text-indigo-600 border-b border-gray-50 transition"
                  >
                    Company Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleViewProfileClick();
                      setMenuOpen(false);
                    }}
                    className="text-left px-6 py-4 hover:bg-indigo-50 hover:text-indigo-600 border-b border-gray-50 transition"
                  >
                    View Profile
                  </button>
                </>
              )}

              {isStudent && (
                <>
                  <button
                    onClick={() => {
                      navigate("/studentdashboard");
                      setMenuOpen(false);
                    }}
                    className="text-left px-6 py-4 hover:bg-indigo-50 hover:text-indigo-600 border-b border-gray-50 transition"
                  >
                    Student Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleViewProfileClick();
                      setMenuOpen(false);
                    }}
                    className="text-left px-6 py-4 hover:bg-indigo-50 hover:text-indigo-600 border-b border-gray-50 transition"
                  >
                    View Profile
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-left px-6 py-4 text-red-600 hover:bg-red-50 transition font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;