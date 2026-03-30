import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router";
import { fetchJobs, selectJobs, selectJobsError, selectJobsLoading } from "../../slices/jobSlice";
import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

const JobsByDriveAndCompany = () => {
  const { driveId, companyId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobs = useSelector(selectJobs);
  const loading = useSelector(selectJobsLoading);
  const error = useSelector(selectJobsError);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const filteredJobs = jobs.filter((job) => {
    const jobDriveId = job.placementDrive?._id || job.placementDrive;
    const jobCompanyId = typeof job.company === "string" ? job.company : job.company?._id;
    return jobDriveId === driveId && jobCompanyId === companyId;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button
          onClick={() => navigate(`/student/applyJob/${driveId}`)}
          className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm"
        >
          <FaArrowLeft className="mr-2" /> Back to Companies
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Available Job Roles</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Review the requirements and apply to roles that match your skills.</p>
        </div>
      </div>

      {/* Main Content List */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        {loading && <p className="text-center text-slate-500 font-bold bg-white p-8 rounded-2xl shadow">Loading jobs...</p>}
        {error && <p className="text-center text-red-500 font-bold bg-white p-8 rounded-2xl shadow">Error: {error}</p>}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="bg-white shadow-xl rounded-2xl p-12 text-center border border-slate-100">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-slate-500 font-medium text-lg">No jobs found for this company in this placement drive.</p>
          </div>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <Link to={`/student/applyJob/${driveId}/${companyId}/${job._id}`} key={job._id} className="block group outline-none">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition mb-2">{job.title}</h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">💰 {job.salary || "Unspecified"}</span>
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">📍 {job.location || "Unspecified"}</span>
                        <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                          ⏳ Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "Open"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex-shrink-0">
                      <span className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-bold rounded-full group-hover:bg-indigo-700 transition shadow">
                        Apply Now
                      </span>
                    </div>
                  </div>
                  
                  {job.description && <p className="text-slate-600 mb-6 line-clamp-2">{job.description}</p>}
                  
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired?.length > 0 ? (
                        job.skillsRequired.map((skill, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-semibold border border-slate-200">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-sm">Not specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsByDriveAndCompany;