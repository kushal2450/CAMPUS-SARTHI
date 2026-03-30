import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { getApplicationById, selectApplicationById, updateApplication } from "../../slices/applicationSlice";
import { fetchJobById, selectSelectedJob } from "../../slices/jobSlice";
import { useEffect, useState } from "react";
import { fetchUserById } from "../../slices/authSlice";
import { FaBriefcase, FaCalendarCheck, FaMapMarkerAlt, FaUser, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const statusOptions = ["Submitted", "Under Review", "Shortlisted", "Rejected", "Hired"];

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const application = useSelector((state) => selectApplicationById(state, id));
  const job = useSelector(selectSelectedJob);
  const [candidate, setCandidate] = useState(null);

  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getApplicationById(id)).unwrap().then((app) => {
      setStatus(app.status || "");
      if (app.job) dispatch(fetchJobById(app.job));
      if (app.candidate) {
        dispatch(fetchUserById(app.candidate)).unwrap().then(setCandidate).catch(() => {});
      }
    }).catch(() => setError("Failed to load application."));
  }, [dispatch, id]);

  const handleSave = async () => {
    if (!application) return;
    setSaving(true); setError(null);
    try {
      await dispatch(updateApplication({ id: application?._id, data: { status } })).unwrap();
      toast.success("Status updated successfully.");
    } catch { toast.error("Failed to update status."); }
    setSaving(false);
  };

  if (!application) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading details...</div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Back to Review
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Application Profile</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Review candidate details and update hiring status.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Applicant Card */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <div className="flex items-center mb-4 space-x-3 border-b border-slate-200 pb-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xl"><FaUser /></div>
                <h2 className="text-xl font-bold text-slate-800">Candidate Info</h2>
              </div>
              <div className="space-y-2 text-slate-700 font-medium">
                <p><span className="text-slate-400 block text-xs uppercase tracking-wider">Name</span> <span className="text-lg">{candidate?.name || "N/A"}</span></p>
                <p><span className="text-slate-400 block text-xs uppercase tracking-wider mt-2">Email</span> {candidate?.email || "N/A"}</p>
                <p><span className="text-slate-400 block text-xs uppercase tracking-wider mt-2">Phone</span> {candidate?.phone || "N/A"}</p>
              </div>
            </div>

            {/* Job Card */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <div className="flex items-center mb-4 space-x-3 border-b border-slate-200 pb-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xl"><FaBriefcase /></div>
                <h2 className="text-xl font-bold text-slate-800">Applied Role</h2>
              </div>
              <div className="space-y-3 text-slate-700 font-medium">
                <p><span className="text-slate-400 block text-xs uppercase tracking-wider">Title</span> <span className="text-lg font-bold text-indigo-700">{job?.title || "N/A"}</span></p>
                <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-slate-400" /> {job?.location || "N/A"}</div>
                <div className="flex items-center gap-2"><FaCalendarCheck className="text-slate-400" /> Applied: {new Date(application.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
            {/* Status Update */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider">Update Status</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={saving} className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700">
                  {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <button onClick={handleSave} disabled={saving} className={`px-8 py-4 rounded-xl text-white font-bold shadow-lg transition transform hover:-translate-y-0.5 ${saving ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                  {saving ? "Saving..." : "Update"}
                </button>
              </div>
            </div>

            {/* Resume Action */}
            <div className="flex flex-col items-center justify-center bg-indigo-50 rounded-xl border border-indigo-100 p-6">
              <span className="text-4xl mb-3 block">📄</span>
              {application.resume ? (
                <a href={application.resume} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg shadow border border-indigo-100 hover:bg-indigo-600 hover:text-white transition">
                  Download / View Resume
                </a>
              ) : <p className="text-slate-500 font-medium">No resume attached.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;