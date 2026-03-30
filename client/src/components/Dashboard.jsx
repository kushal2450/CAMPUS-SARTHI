import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import { useNavigate } from "react-router";
import { fetchPlacementDrives, selectPlacementDrives } from "../slices/placementDriveSlice";
import { useEffect } from "react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const placementDrives = useSelector(selectPlacementDrives);
  const navigate = useNavigate();

  const isStudent = user?.role === "student";
  const isCompany = user?.role === "company";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    dispatch(fetchPlacementDrives());
  }, [dispatch]);

  const handleDriveClick = (driveId, role) => {
    if (role === "student") {
      navigate(`/student/applyJob/${driveId}`);
    } else if (role === "company") {
      navigate(`/company/postJob/${driveId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* 1. Integrated Navbar */}
      

      {/* 2. Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-8 shadow-lg rounded-b-[2.5rem] mb-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Placement Dashboard
          </h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100 max-w-2xl mx-auto">
            {isCompany && "Select a placement drive to post jobs for your company."}
            {isStudent && "Select a placement drive to explore and apply for opportunities."}
            {isAdmin && "As an admin, view and manage placement drives for both students and companies."}
            {!isCompany && !isStudent && !isAdmin && "Please log in to interact with placement drives."}
          </p>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="max-w-7xl mx-auto px-6">
        <main>
          {isAdmin ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Admin: Student Drives */}
              <section>
                <div className="flex items-center space-x-3 mb-6 border-b-2 border-slate-200 pb-2">
                  <span className="text-2xl">🎓</span>
                  <h2 className="text-2xl font-bold text-slate-800">Student Drives</h2>
                </div>
                <ul className="grid grid-cols-1 gap-6">
                  {placementDrives.map((drive) => (
                    <li
                      key={drive._id}
                      onClick={() => handleDriveClick(drive._id, "student")}
                      tabIndex={0}
                      role="button"
                      className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition duration-300 group"
                    >
                      <h3 className="text-xl font-bold text-slate-800 mb-1 truncate group-hover:text-indigo-600 transition">{drive.title}</h3>
                      <div className="flex items-center text-sm mb-3 text-slate-500 font-medium">
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs">
                          {drive.startDate ? new Date(drive.startDate).toLocaleDateString() : "TBA"}
                        </span>
                      </div>
                      <p className="text-slate-600 line-clamp-3 text-sm">{drive.description}</p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Admin: Company Drives */}
              <section>
                <div className="flex items-center space-x-3 mb-6 border-b-2 border-slate-200 pb-2">
                  <span className="text-2xl">🏢</span>
                  <h2 className="text-2xl font-bold text-slate-800">Company Drives</h2>
                </div>
                <ul className="grid grid-cols-1 gap-6">
                  {placementDrives.map((drive) => (
                    <li
                      key={drive._id}
                      onClick={() => handleDriveClick(drive._id, "company")}
                      tabIndex={0}
                      role="button"
                      className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition duration-300 group"
                    >
                      <h3 className="text-xl font-bold text-slate-800 mb-1 truncate group-hover:text-purple-600 transition">{drive.title}</h3>
                      <div className="flex items-center text-sm mb-3 text-slate-500 font-medium">
                        <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs">
                          {drive.startDate ? new Date(drive.startDate).toLocaleDateString() : "TBA"}
                        </span>
                      </div>
                      <p className="text-slate-600 line-clamp-3 text-sm">{drive.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ) : (
            
            /* Student & Company View */
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <span className="text-3xl">🚀</span>
                <h2 className="text-3xl font-bold text-slate-800">Available Drives</h2>
              </div>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {placementDrives.map((drive) => (
                  <li
                    key={drive._id}
                    onClick={() => handleDriveClick(drive._id, isStudent ? "student" : "company")}
                    tabIndex={0}
                    role="button"
                    className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition duration-300 group flex flex-col"
                  >
                    <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                      {isStudent ? '🎓' : '💼'}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{drive.title}</h3>
                    <div className="mb-4">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {drive.startDate ? new Date(drive.startDate).toLocaleDateString() : "Date TBA"}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-3 text-sm flex-grow">{drive.description}</p>
                    
                    <div className="mt-6 text-indigo-600 font-bold text-sm flex items-center group-hover:text-indigo-800">
                      {isStudent ? 'View Opportunities' : 'Post a Job'} <span className="ml-2">→</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;