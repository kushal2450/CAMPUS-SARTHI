import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, selectJobs } from "../slices/jobSlice";
import { fetchPlacementDrives, selectPlacementDrives } from "../slices/placementDriveSlice";
import { fetchCompanies, selectAllCompanies } from "../slices/companySlice";
import { useEffect, useState } from "react";

const AllDrivesCompaniesJobs = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectJobs);
  const placementDrives = useSelector(selectPlacementDrives);
  const companies = useSelector(selectAllCompanies);

  const [selectedDriveId, setSelectedDriveId] = useState("");

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchPlacementDrives());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const getCompanyName = (companyId) => companies.find((c) => c._id === companyId)?.name || companyId;

  const categorized = {};
  jobs.forEach((job) => {
    const driveId = job.placementDrive?._id || job.placementDrive;
    if (!categorized[driveId]) categorized[driveId] = {};
    if (!categorized[driveId][job.company]) categorized[driveId][job.company] = [];
    categorized[driveId][job.company].push(job);
  });

  const drivesToShow = selectedDriveId ? placementDrives.filter((d) => d._id === selectedDriveId) : placementDrives;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Global Drive Mapping</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">View the hierarchical mapping of Drives → Companies → Jobs.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        
        {/* Filter Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between border border-slate-100">
          <label className="font-bold text-slate-700 mb-2 sm:mb-0">Filter by Placement Drive:</label>
          <select
            value={selectedDriveId}
            onChange={(e) => setSelectedDriveId(e.target.value)}
            className="w-full sm:w-auto p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
          >
            <option value="">View All Active Drives</option>
            {placementDrives.map((drive) => (
              <option key={drive._id} value={drive._id}>{drive.title}</option>
            ))}
          </select>
        </div>

        {drivesToShow.length === 0 && (
          <div className="bg-white shadow-xl rounded-2xl p-12 text-center border border-slate-100">
            <span className="text-4xl block mb-3">🗂️</span>
            <p className="text-slate-500 font-bold text-lg">No placement drives found.</p>
          </div>
        )}

        <div className="space-y-8">
          {drivesToShow.map((drive) => (
            <div key={drive._id} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              {/* Drive Header */}
              <div className="bg-indigo-50 border-b border-slate-100 px-8 py-5 flex items-center gap-4">
                <span className="text-3xl">🎓</span>
                <h3 className="text-2xl font-black text-indigo-800">{drive.title}</h3>
              </div>

              <div className="p-8">
                {categorized[drive._id] ? (
                  <div className="space-y-8">
                    {Object.keys(categorized[drive._id]).map((companyId) => (
                      <div key={companyId} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        {/* Company Header */}
                        <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-3">
                          <span className="text-2xl">🏢</span>
                          <h4 className="text-xl font-bold text-slate-800">{getCompanyName(companyId)}</h4>
                        </div>
                        
                        {/* Jobs List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categorized[drive._id][companyId].map((job) => (
                            <div key={job._id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <span className="block font-bold text-indigo-600 text-lg mb-1">{job.title}</span>
                              <div className="flex flex-wrap gap-2 text-xs font-bold mt-2">
                                {job.location && <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">📍 {job.location}</span>}
                                {job.salary && <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">💰 {job.salary}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 font-medium italic text-center py-6">No companies or jobs have been assigned to this drive yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AllDrivesCompaniesJobs;