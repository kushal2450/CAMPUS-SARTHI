import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCompanyDashboard,
  selectDashboardApplicationsReceived,
  selectDashboardError,
  selectDashboardErrorMessage,
  selectDashboardJobsPosted,
  selectDashboardLoading,
  selectDashboardUpcomingInterviews,
} from '../../slices/companySlice';
import { useNavigate } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa';

const CompanyDashboard = () => {
  const dispatch = useDispatch();
  const jobsPosted = useSelector(selectDashboardJobsPosted);
  const applicationsReceived = useSelector(selectDashboardApplicationsReceived);
  const upcomingInterviews = useSelector(selectDashboardUpcomingInterviews);
  const isLoading = useSelector(selectDashboardLoading);
  const isError = useSelector(selectDashboardError);
  const errorMessage = useSelector(selectDashboardErrorMessage);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCompanyDashboard());
  }, [dispatch]);

  const stats = [
    { label: 'Jobs Posted', count: jobsPosted, icon: '💼', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', navigateTo: '/company/companyJobs' },
    { label: 'Applications Received', count: applicationsReceived, icon: '📥', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', navigateTo: '/company/applications' },
    { label: 'Upcoming Interviews', count: upcomingInterviews, icon: '📅', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', navigateTo: '/company/interview' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm"
        >
          <FaArrowLeft className="mr-2" /> Home
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Recruiter Dashboard</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Manage your job postings, review applications, and schedule interviews.</p>
        </div>
      </div>

      {/* Floating Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        {isLoading ? (
          <div className="bg-white shadow-xl rounded-2xl p-12 text-center border border-slate-100">
            <p className="text-slate-500 font-bold text-lg">Loading dashboard metrics...</p>
          </div>
        ) : isError ? (
          <div className="bg-white shadow-xl rounded-2xl p-12 text-center border border-red-100">
            <p className="text-red-500 font-bold text-lg">Error: {errorMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map(({ label, count, icon, color, bg, border, navigateTo }) => (
              <button
                key={label}
                onClick={() => navigate(navigateTo)}
                className={`flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 border-2 border-transparent hover:${border} group outline-none`}
              >
                <div className={`w-16 h-16 rounded-2xl ${bg} ${color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition transform`}>
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-slate-600 uppercase tracking-wide mb-2">{label}</h3>
                <p className="text-5xl font-extrabold text-slate-800">{count}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;