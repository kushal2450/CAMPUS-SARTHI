import { useDispatch, useSelector } from "react-redux";
import { fetchPlacementDrives, selectPlacementDrives, selectPlacementDrivesError, selectPlacementDrivesLoading } from "../slices/placementDriveSlice";
import { fetchApplications, selectAllApplications, selectApplicationError, selectApplicationLoading } from "../slices/applicationSlice";
import { fetchJobs, selectJobs, selectJobsError, selectJobsLoading } from "../slices/jobSlice";
import { fetchInterviews, selectAllInterviews, selectInterviewError, selectInterviewErrorMessage, selectInterviewLoading } from "../slices/interviewSlice";
import { useEffect } from "react";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const placementDrives = useSelector(selectPlacementDrives);
  const placementDrivesLoading = useSelector(selectPlacementDrivesLoading);
  const placementDrivesError = useSelector(selectPlacementDrivesError);

  const applications = useSelector(selectAllApplications);
  const applicationLoading = useSelector(selectApplicationLoading);
  const applicationError = useSelector(selectApplicationError);

  const jobs = useSelector(selectJobs);
  const jobsLoading = useSelector(selectJobsLoading);
  const jobsError = useSelector(selectJobsError);

  const interviews = useSelector(selectAllInterviews);
  const interviewLoading = useSelector(selectInterviewLoading);
  const interviewError = useSelector(selectInterviewError);
  const interviewErrorMessage = useSelector(selectInterviewErrorMessage);

  useEffect(() => {
    dispatch(fetchPlacementDrives());
    dispatch(fetchApplications());
    dispatch(fetchJobs());
    dispatch(fetchInterviews());
  }, [dispatch]);

  const offersMade = interviews.filter(i => i.result === 'Selected').length;

  const isLoading = placementDrivesLoading || applicationLoading || jobsLoading || interviewLoading;
  const isError = placementDrivesError || applicationError || jobsError || interviewError;

  const stats = [
    { label: "Placement Drives", count: placementDrives.length ?? 0, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Applications", count: applications?.length ?? 0, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Jobs Posted", count: jobs.length ?? 0, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Interviews Scheduled", count: interviews.length ?? 0, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Offers Made", count: offersMade ?? 0, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem]">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Admin Control Center</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Monitor system activity, manage drives, and oversee university placements.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        {isLoading && (
          <div className="bg-white shadow-xl rounded-2xl p-12 text-center border border-slate-100">
            <p className="text-slate-500 font-bold text-lg">Synchronizing system data...</p>
          </div>
        )}

        {isError && (
          <div className="bg-white shadow-xl rounded-2xl p-12 text-center border border-red-100 mb-8">
            <p className="text-red-500 font-bold text-lg">System Error Detected:</p>
            <ul className="text-red-400 mt-2 text-sm">
              {applicationError && <li>{applicationError}</li>}
              {placementDrivesError && <li>{placementDrivesError}</li>}
              {jobsError && <li>{jobsError}</li>}
              {interviewError && <li>{interviewErrorMessage}</li>}
            </ul>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col items-center justify-center text-center group">
                <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-2xl font-black mb-4 group-hover:scale-110 transition transform`}>
                  {stat.count}
                </div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">{stat.label}</h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;