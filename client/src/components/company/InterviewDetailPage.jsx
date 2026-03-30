import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchInterviewById, selectInterviewError, selectInterviewLoading, updateInterview } from "../../slices/interviewSlice";
import { FaArrowLeft, FaUserCheck, FaCalendarAlt, FaClock, FaBriefcase } from "react-icons/fa";

const resultOptions = ['Pending', 'Shortlisted', 'Rejected', 'Selected'];

const InterviewDetailPage = () => {
  const { interviewId: id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const interview = useSelector(state => state.interview.interview);
  const loading = useSelector(selectInterviewLoading);
  const error = useSelector(selectInterviewError);

  const [editState, setEditState] = useState({ result: '', score: '', feedback: '' });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => { dispatch(fetchInterviewById(id)); }, [id, dispatch]);

  useEffect(() => {
    if (interview) {
      setEditState({ result: interview.result || '', score: interview.score || '', feedback: interview.feedback || '' });
      setSuccessMessage(null);
    }
  }, [interview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditState(prev => ({ ...prev, [name]: value }));
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    if (!interview) return;
    setSaving(true);
    try {
      await dispatch(updateInterview({
        id,
        data: {
          result: editState.result,
          score: editState.result === 'Shortlisted' ? null : Number(editState.score),
          feedback: editState.result === 'Shortlisted' ? null : editState.feedback,
          emailType: editState.result === 'Pending' ? 'schedule' : 'result'
        },
      })).unwrap();
      setSuccessMessage("Interview details updated successfully.");
    } catch { setSuccessMessage("Failed to update interview details."); }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Loading interview details...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">{error}</div>;
  if (!interview) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Interview not found.</div>;

  const inputClass = "w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Interview Dashboard</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Review details and submit candidate feedback.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10 grid md:grid-cols-3 gap-8">
        
        {/* Info Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-4">Details</h2>
            <div className="space-y-4">
              <div className="flex items-center text-slate-700 font-medium"><FaUserCheck className="text-indigo-500 w-5 h-5 mr-3" /> {interview.candidate?.name || 'N/A'}</div>
              <div className="flex items-center text-slate-700 font-medium"><FaBriefcase className="text-indigo-500 w-5 h-5 mr-3" /> {interview.job?.title || 'N/A'}</div>
              <div className="flex items-center text-slate-700 font-medium"><FaCalendarAlt className="text-indigo-500 w-5 h-5 mr-3" /> {new Date(interview.interviewDate).toLocaleString()}</div>
              <div className="flex items-center text-slate-700 font-medium"><FaClock className="text-indigo-500 w-5 h-5 mr-3" /> {interview.durationMinutes} mins ({interview.interviewType})</div>
              
              <div className="pt-4 mt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Status</p>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">{interview.status}</span>
                <span className="ml-2 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">{interview.round}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Column */}
        <div className="md:col-span-2 bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Evaluation & Feedback</h2>
          
          <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-bold text-slate-700">Interview Result</label>
                <select name="result" value={editState.result} onChange={handleChange} className={inputClass}>
                  {resultOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-bold text-slate-700">Candidate Score (0-100)</label>
                <input name="score" type="number" min="0" max="100" value={editState.score} onChange={handleChange} placeholder="e.g. 85" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-bold text-slate-700">Recruiter Feedback</label>
              <textarea name="feedback" rows={4} value={editState.feedback} onChange={handleChange} placeholder="Detailed notes on candidate performance..." className={`${inputClass} resize-y`} />
            </div>

            {successMessage && (
              <div className={`p-4 rounded-lg font-bold text-center ${successMessage.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                {successMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={handleSave} disabled={saving} className={`flex-1 py-4 rounded-xl text-white font-bold shadow-lg transition transform hover:-translate-y-0.5 ${saving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {saving ? 'Saving...' : 'Save Evaluation'}
              </button>
              <button onClick={() => navigate(`/company/interview/interviewFeedback/${id}`)} disabled={saving} className="flex-1 py-4 rounded-xl text-white font-bold shadow-lg bg-slate-800 hover:bg-slate-900 transition transform hover:-translate-y-0.5">
                Send Formal Feedback
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InterviewDetailPage;