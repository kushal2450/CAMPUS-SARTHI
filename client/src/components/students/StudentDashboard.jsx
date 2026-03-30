import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyInterviews,
  selectInterviewError,
  selectInterviewLoading,
  selectInterviewsByStudent,
} from "../../slices/interviewSlice";
import {
  fetchMyApplications,
  selectAllApplications,
  selectApplicationError,
  selectApplicationLoading,
} from "../../slices/applicationSlice";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

// Status label colors for applications
const statusColors = {
  Submitted: "bg-slate-100 text-slate-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  Shortlisted: "bg-blue-100 text-blue-700",
  Rejected: "bg-red-100 text-red-700",
  Hired: "bg-emerald-100 text-emerald-700",
};

const StudentDashBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Interviews state
  const userId = useSelector((state) => state.auth.user?._id);
  const interviews = useSelector((state) => selectInterviewsByStudent(state, userId));
  const interviewLoading = useSelector(selectInterviewLoading);
  const interviewError = useSelector(selectInterviewError);

  // Applications state
  const applications = useSelector(selectAllApplications);
  const applicationLoading = useSelector(selectApplicationLoading);
  const applicationError = useSelector(selectApplicationError);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMyInterviews());
      dispatch(fetchMyApplications());
    }
  }, [dispatch, userId]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      {/* 1. Gradient Header with Glassmorphism Back Button */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm"
          aria-label="Go back"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">My Tracking Dashboard</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100 max-w-2xl mx-auto">
            Manage your upcoming interviews and track your application statuses in real-time.
          </p>
        </div>
      </div>

      {/* 2. Floating Content Container */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-10 space-y-12">
        
        {/* Interview Schedule Section */}
        <section className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          <div className="flex items-center space-x-3 mb-6 border-b-2 border-slate-100 pb-4">
            <span className="text-3xl">📅</span>
            <h2 className="text-2xl font-bold text-slate-800">My Interview Schedule</h2>
          </div>

          {interviewLoading ? (
            <p className="text-center text-slate-500 font-medium py-8">Loading interviews...</p>
          ) : interviewError ? (
            <p className="text-center text-red-500 font-medium py-8">Error: {interviewError}</p>
          ) : !interviews.length ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No interviews scheduled yet. Keep applying!</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Job / Drive</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Location / Link</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {interviews.map(({ _id, job, interviewDate, location, interviewType, meetingId, status }) => (
                    <tr key={_id} className="hover:bg-indigo-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-semibold">{job?.title || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">{new Date(interviewDate).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {interviewType === "Online" ? (
                          <a
                            href={`https://placementmanagementsystem-project.netlify.app/students/${meetingId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
                          >
                            🔗 Join Meeting
                          </a>
                        ) : (
                          <span className="text-slate-600">📍 {location || "N/A"}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          status === "Scheduled" ? "bg-blue-100 text-blue-700" : 
                          status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                        }`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Applications Section */}
        <section className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          <div className="flex items-center space-x-3 mb-6 border-b-2 border-slate-100 pb-4">
            <span className="text-3xl">✅</span>
            <h2 className="text-2xl font-bold text-slate-800">My Applications</h2>
          </div>

          {applicationLoading ? (
            <p className="text-center text-slate-500 font-medium py-8">Loading applications...</p>
          ) : applicationError ? (
            <p className="text-center text-red-500 font-medium py-8">Error: {applicationError}</p>
          ) : !applications.length ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No applications found. Time to explore companies!</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Job Role</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Applied On</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-indigo-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-semibold">{app.job?.title || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide ${statusColors[app.status] || "bg-slate-200 text-slate-700"}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                        <button className="text-indigo-600 hover:text-indigo-800 mr-4 transition">Update</button>
                        <button className="text-red-500 hover:text-red-700 transition">Withdraw</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentDashBoard;