import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { deleteJob, fetchJobs, selectJobs, selectJobsError, selectJobsLoading } from "../../slices/jobSlice";
import { useEffect } from "react";
import { selectAuthUser } from "../../slices/authSlice";
import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";
import { FaArrowLeft } from "react-icons/fa";

const CompanyJobsList = () => {
  const currentUser = useSelector(selectAuthUser);
  const company = useSelector(selectAllCompanies);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobs = useSelector(selectJobs);
  const loading = useSelector(selectJobsLoading);
  const error = useSelector(selectJobsError);

  const companyIdFromUser = company.filter(c => c.user === currentUser._id)[0]?._id;

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const filteredJobs = jobs.filter((job) => job.company === companyIdFromUser);

  const handleDelete = (jobId) => {
    if (window.confirm("Are you sure you want to permanently delete this job posting?")) {
      dispatch(deleteJob(jobId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button
          onClick={() => navigate("/companydashboard")}
          className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm"
        >
          <FaArrowLeft className="mr-2" /> Dashboard
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Manage Job Postings</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Review, edit, or delete the roles you have currently posted.</p>
        </div>
      </div>

      {/* Floating Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        {loading && <p className="text-center text-slate-500 font-bold bg-white p-8 rounded-2xl shadow">Loading jobs...</p>}
        {error && <p className="text-center text-red-500 font-bold bg-white p-8 rounded-2xl shadow">Error: {error}</p>}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="bg-white shadow-xl rounded-2xl p-12 text-center border border-slate-100">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-slate-500 font-medium text-lg mb-6">You haven't posted any jobs yet.</p>
            <Link to="/company/postJob" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow hover:bg-indigo-700 transition">
              Post Your First Job
            </Link>
          </div>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition duration-300 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">{job.title}</h2>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "Open"}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">💰 {job.salary || "Unspecified"}</span>
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">📍 {job.location || "Unspecified"}</span>
                </div>

                <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">{job.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired?.length > 0 ? (
                      job.skillsRequired.map((skill, idx) => (
                        <span key={idx} className="bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-200 text-xs font-semibold">
                          {skill}
                        </span>
                      ))
                    ) : <span className="text-slate-400 text-xs">Not specified</span>}
                  </div>
                </div>

                <div className="flex gap-4 mt-auto pt-4 border-t border-slate-100">
                  <Link to={`/company/editJob/${job._id}`} className="flex-1 text-center py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition">
                    Edit Details
                  </Link>
                  <button onClick={() => handleDelete(job._id)} className="flex-1 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition">
                    Delete Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyJobsList;