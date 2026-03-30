import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedStudent, fetchStudentById, selectSelectedStudent, selectStudentError, selectStudentLoading } from "../slices/studentSlice";
import { fetchApplications, selectAllApplications } from "../slices/applicationSlice";
import { useParams, useNavigate } from "react-router";
import { FaArrowLeft, FaUserGraduate, FaFileAlt } from "react-icons/fa";

const StudentDetail = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const student = useSelector(selectSelectedStudent);
  const loading = useSelector(selectStudentLoading);
  const error = useSelector(selectStudentError);
  const applications = useSelector(selectAllApplications);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentById(studentId));
      dispatch(fetchApplications());
    }
    return () => dispatch(clearSelectedStudent());
  }, [dispatch, studentId]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading student dossier...</div>;
  if (error || !student) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-500">Record not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="max-w-4xl mx-auto text-center mt-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mx-auto flex items-center justify-center text-4xl mb-4 border-2 border-white/40">
            <FaUserGraduate />
          </div>
          <h1 className="text-4xl font-extrabold mb-2 drop-shadow-lg">{student.userId?.name || "Unknown Student"}</h1>
          <p className="text-lg font-bold text-indigo-200">{student.userId?.email || "No Email"}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 space-y-8">
        
        {/* Core Info & Bio */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Biography & ID</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="block text-xs font-bold text-slate-400 uppercase">System ID</span>
              <span className="font-mono text-slate-700">{student.userId?._id || "N/A"}</span>
            </div>
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Biography</span>
              <p className="text-slate-700 font-medium">{student.bio || <span className="italic text-slate-400">No bio provided.</span>}</p>
            </div>
          </div>
        </div>

        {/* Education & Apps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Academic History</h2>
            {student.education?.length ? (
              <div className="space-y-4">
                {student.education.map((edu, idx) => (
                  <div key={idx} className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 relative pl-10">
                    <div className="absolute left-4 top-5 w-2 h-2 rounded-full bg-indigo-500"></div>
                    <h3 className="font-bold text-indigo-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <p className="text-indigo-700 font-medium text-sm">{edu.institution}</p>
                    <p className="text-indigo-400 font-bold text-xs mt-2">{edu.startYear} — {edu.endYear}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-500 italic font-medium">No education history recorded.</p>}
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3 flex items-center justify-between">
              Application Tracker
              <FaFileAlt className="text-slate-300" />
            </h2>
            {applications?.length ? (
              <div className="space-y-3">
                {applications.map((app, idx) => (
                  <div key={app._id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition border border-transparent hover:border-slate-200">
                    <div>
                      <p className="font-bold text-slate-800">{(typeof app.job === "object" ? app.job?.title : app.job) || "Unknown Role"}</p>
                      <p className="text-xs font-bold text-slate-500">{(typeof app.company === "object" ? app.company?.name : app.company) || "Unknown Company"}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'Hired' ? 'bg-emerald-100 text-emerald-700' :
                      app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-500 italic font-medium">No active applications.</p>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDetail;