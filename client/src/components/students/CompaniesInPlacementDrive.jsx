import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router";
import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";
import { fetchJobs, selectJobs } from "../../slices/jobSlice";
import { useEffect } from "react";
import { FiMapPin, FiGlobe } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";

const CompaniesInPlacementDrive = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { driveId } = useParams();
  const companies = useSelector(selectAllCompanies);
  const jobs = useSelector(selectJobs);

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchJobs());
  }, [dispatch]);

  const jobsInDrive = jobs.filter(
    (job) => job.placementDrive?._id === driveId || job.placementDrive === driveId
  );

  const uniqueCompanyIds = [
    ...new Set(jobsInDrive.map((job) => typeof job.company === "string" ? job.company : job.company?._id)),
  ];

  const filteredCompanies = companies.filter((company) => uniqueCompanyIds.includes(company._id));

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button
          onClick={() => navigate("/student/dashboard")}
          className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm"
        >
          <FaArrowLeft className="mr-2" /> Dashboard
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Participating Companies</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Select a company to view their available job roles.</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        {filteredCompanies.length === 0 ? (
          <div className="bg-white shadow-xl rounded-2xl p-12 text-center border border-slate-100">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-slate-500 font-medium text-lg">No companies found for this placement drive yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company) => (
              <Link to={`/student/applyJob/${driveId}/${company._id}`} key={company._id} className="group outline-none">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full">
                  <div className="bg-indigo-50 text-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition">
                    🏢
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition">
                    {company.name}
                  </h2>
                  {company.industry && (
                    <span className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide mb-6">
                      {company.industry}
                    </span>
                  )}
                  <div className="mt-auto space-y-3">
                    {company.location?.city && (
                      <div className="flex items-center text-slate-500 text-sm font-medium">
                        <FiMapPin className="mr-2 text-indigo-500" />
                        {company.location.city}, {company.location.country}
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center text-sm font-medium">
                        <FiGlobe className="mr-2 text-indigo-500" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-indigo-600 hover:text-indigo-800 hover:underline">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 text-indigo-600 font-bold text-sm flex items-center group-hover:text-indigo-800">
                    View Jobs <span className="ml-2">→</span>
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

export default CompaniesInPlacementDrive;