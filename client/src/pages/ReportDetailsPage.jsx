import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { fetchReportById, selectSelectedReport, selectReportError, selectReportLoading, resetReportState } from "../slices/reportSlice";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { FaArrowLeft, FaFileDownload } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import PrintableReport from "./PrintableReport";

const COLORS = ['#4f46e5', '#cbd5e1']; // Indigo-600 and Slate-300
const formatNumber = (num) => (num ? num.toLocaleString() : "N/A");

const ReportDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedReport = useSelector(selectSelectedReport);
  const loading = useSelector(selectReportLoading);
  const error = useSelector(selectReportError);

  useEffect(() => {
    dispatch(fetchReportById(id));
    return () => dispatch(resetReportState());
  }, [dispatch, id]);

  const handleExportPDF = () => {
    const element = document.getElementById("report-pdf-content");
    if (!element) return;
    
    // Temporarily make it visible for the snapshot
    element.style.position = "relative"; element.style.left = "0"; element.style.opacity = "1";
    
    html2pdf().set({
        margin: 0.4,
        filename: `Placement_Report_${selectedReport?.placementDrive?.title || "Data"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      }).from(element).save()
      .finally(() => {
        // Hide it again
        element.style.position = "fixed"; element.style.left = "-9999px"; element.style.opacity = "0";
      });
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading analytics...</div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-500">Error: {error}</div>;
  if (!selectedReport) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">No report data found.</div>;

  const { placementDrive, participantCount, interviewCount, offersMade, studentsPlaced, summary } = selectedReport;

  const barData = [
    { name: "Participants", count: participantCount },
    { name: "Interviews", count: interviewCount },
    { name: "Offers", count: offersMade },
    { name: "Placed", count: studentsPlaced },
  ];

  const pieData = [
    { name: "Placed", value: studentsPlaced },
    { name: "Not Placed", value: participantCount - studentsPlaced },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <div className="flex justify-between items-center max-w-6xl mx-auto absolute top-6 left-6 right-6 md:left-12 md:right-12">
          <button onClick={() => navigate(-1)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <button onClick={handleExportPDF} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full flex items-center transition font-bold shadow-lg">
            <FaFileDownload className="mr-2" /> Export PDF
          </button>
        </div>
        <div className="max-w-4xl mx-auto text-center mt-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Report Overview</h1>
          <p className="text-lg md:text-xl font-bold text-indigo-200">{placementDrive?.title || "Placement Drive"}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-10 space-y-8">
        
        {/* Core Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Participants", val: formatNumber(participantCount), icon: "👨‍🎓", color: "text-blue-600" },
            { label: "Interviews", val: formatNumber(interviewCount), icon: "🗣️", color: "text-indigo-600" },
            { label: "Offers Made", val: formatNumber(offersMade), icon: "📄", color: "text-purple-600" },
            { label: "Total Placed", val: formatNumber(studentsPlaced), icon: "🎉", color: "text-emerald-600" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 text-center flex flex-col items-center">
              <span className="text-3xl mb-2">{stat.icon}</span>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.val}</p>
              <h3 className="text-xs font-bold text-slate-500 uppercase mt-1">{stat.label}</h3>
            </div>
          ))}
        </div>

        {/* Charts Area */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Visual Analytics</h2>
          <div className="flex flex-col md:flex-row gap-12 justify-around items-center">
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold mb-4 text-slate-700 text-center">Pipeline Funnel</h3>
              <BarChart width={350} height={250} data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={12} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} fontSize={12} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col items-center">
              <h3 className="text-lg font-bold mb-4 text-slate-700 text-center">Success Distribution</h3>
              <PieChart width={250} height={250}>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </div>

          </div>
        </div>

        {/* Summary Area */}
        {summary && (
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">Executive Summary</h2>
            <pre className="whitespace-pre-wrap font-sans text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-200">
              {summary}
            </pre>
          </div>
        )}
      </div>

      {/* Hidden printable content */}
      <div id="report-pdf-content" style={{ position: "fixed", top: 0, left: "-9999px", width: "210mm", backgroundColor: "#fff", opacity: 0, zIndex: -1 }}>
        <PrintableReport report={selectedReport} />
      </div>
    </div>
  );
};

export default ReportDetailsPage;