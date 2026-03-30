import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchJobs, selectJobs, selectJobsError, selectJobsLoading } from "../../slices/jobSlice";
import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";
import { useEffect, useState } from "react";
import applicationApi from "../../api/applicationsApi";
import { FaArrowLeft } from "react-icons/fa";

const statusOptions = [
  { label: "All Statuses", value: "" }, { label: "Submitted", value: "Submitted" },
  { label: "Under Review", value: "Under Review" }, { label: "Shortlisted", value: "Shortlisted" },
  { label: "Rejected", value: "Rejected" }, { label: "Hired", value: "Hired" },
];

const ApplicationReviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobs = useSelector(selectJobs);
  const jobsLoading = useSelector(selectJobsLoading);
  const jobsError = useSelector(selectJobsError);
  const user = useSelector((state) => state.auth.user);
  const companies = useSelector(selectAllCompanies);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ jobId: "", status: "" });

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const userCompanies = companies.filter((c) => c.user === user._id);
  const userCompanyIds = userCompanies.map((c) => c._id);
  const filteredJobs = jobs.filter((j) => userCompanyIds.includes(j.company));

  const fetchApplications = async () => {
    setLoading(true); setError(null);
    try {
      const params = {};
      if (filters.jobId) params.jobId = filters.jobId;
      if (filters.status) params.status = filters.status;
      const response = await applicationApi.getCompanyApplications({ params });
      setApplications(response.data.data);
    } catch (err) { setError("Failed to fetch applications: " + (err.message || "")); }
    setLoading(false);
  };

  useEffect(() => { fetchApplications(); }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate("/companyDashboard")} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Dashboard
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Application Review</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Filter and evaluate candidates who have applied to your roles.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <select name="jobId" value={filters.jobId} onChange={handleFilterChange} className="w-full sm:w-1/2 p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700">
              <option value="">All Jobs</option>
              {filteredJobs.map((job) => <option key={job._id} value={job._id}>{job.title}</option>)}
            </select>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full sm:w-1/2 p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700">
              {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {(jobsLoading || loading) && <p className="text-center text-slate-500 font-bold py-10">Loading data...</p>}
          {(jobsError || error) && <p className="text-center text-red-500 font-bold py-10">{jobsError || error}</p>}

          {!loading && !error && (
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Applied Role</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-600 uppercase tracking-wider">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {applications.length === 0 ? (
                    <tr><td colSpan="5" className="text-center p-8 text-slate-500 font-medium">No applications match your criteria.</td></tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app._id} onClick={() => navigate(`/company/applications/${app._id}`)} className="hover:bg-indigo-50 cursor-pointer transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-slate-800">{app.candidate?.name || "N/A"}</div>
                          <div className="text-sm text-slate-500">{app.candidate?.email || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">{app.job?.title || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            app.status === "Hired" ? "bg-emerald-100 text-emerald-700" :
                            app.status === "Shortlisted" ? "bg-blue-100 text-blue-700" :
                            app.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                          }`}>{app.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {app.resume ? (
                            <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline" onClick={(e) => e.stopPropagation()}>
                              View PDF
                            </a>
                          ) : <span className="text-slate-400 text-sm">None</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationReviewPage;