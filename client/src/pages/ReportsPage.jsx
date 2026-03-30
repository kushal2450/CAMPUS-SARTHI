import { useDispatch, useSelector } from "react-redux";
import { fetchReportById, fetchReports, resetReportState, selectAllReports, selectReportError, selectReportLoading } from "../slices/reportSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

const ReportsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reports = useSelector(selectAllReports);
  const loading = useSelector(selectReportLoading);
  const error = useSelector(selectReportError);

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(fetchReports());
    return () => dispatch(resetReportState());
  }, [dispatch]);

  const handleSelectReport = (id) => {
    setSelectedId(id);
    dispatch(fetchReportById(id));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate('/admin/dashboard')} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Admin Hub
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Placement Analytics</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Review historical data and track university placement success rates.</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Reports List */}
            <aside className="w-full md:w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-6 max-h-[600px] overflow-auto shadow-inner">
              <h2 className="text-xl font-bold mb-6 text-slate-800 border-b border-slate-200 pb-3 flex items-center"><span className="text-2xl mr-2">📊</span> Available Reports</h2>
              
              {loading && <p className="text-center py-8 text-slate-500 font-bold">Loading reports...</p>}
              {error && <p className="text-center py-8 text-red-600 font-bold">{error}</p>}
              {reports.length === 0 && !loading ? (
                <p className="py-12 text-center text-slate-500 font-medium">No reports generated yet.</p>
              ) : (
                <ul className="space-y-4">
                  {reports.map((report) => {
                    const successRate = report.participantCount > 0 ? ((report.studentsPlaced / report.participantCount) * 100).toFixed(1) : 'N/A';
                    const isActive = report._id === selectedId;

                    return (
                      <li key={report._id} className={`rounded-xl transition shadow-sm bg-white border cursor-pointer overflow-hidden ${isActive ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200 hover:border-indigo-300 hover:shadow-md"}`}>
                        <Link to={`/dashboard/reports/${report._id}`} className="block focus:outline-none">
                          <button className="w-full text-left p-5 focus:outline-none" onClick={() => handleSelectReport(report._id)}>
                            <p className="font-bold text-indigo-700 text-lg truncate mb-1">{report.placementDrive?.title || "Unnamed Drive"}</p>
                            <p className="text-sm font-bold text-slate-600 mb-3">{report.placementDrive?.companyName || "Unknown Company"}</p>
                            
                            <div className="flex flex-wrap gap-2 text-xs font-bold mt-2">
                              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">Participants: {report.participantCount}</span>
                              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Offers: {report.offersMade}</span>
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">Success: {successRate}%</span>
                            </div>
                          </button>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </aside>
            
            {/* Instruction Side */}
            <div className="hidden md:flex flex-col justify-center items-center w-full md:w-1/2 p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <span className="text-6xl mb-4">📈</span>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Select a Report</h3>
              <p className="text-slate-500 font-medium">Click on a placement drive report from the list to view detailed analytics, visual charts, and export options.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;