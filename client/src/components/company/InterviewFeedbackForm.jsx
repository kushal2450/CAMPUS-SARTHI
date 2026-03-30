import { useDispatch, useSelector } from "react-redux";
import { clearInterviewError, clearSelectedInterview, clearSuccess, fetchInterviewById, selectCurrentInterview, selectInterviewError, selectInterviewLoading, updateInterview } from "../../slices/interviewSlice";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

const InterviewFeedbackForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { interviewId } = useParams();

  const interview = useSelector(selectCurrentInterview);
  const isLoading = useSelector(selectInterviewLoading);
  const isError = useSelector(selectInterviewError);

  const [form, setForm] = useState({ feedback: '', score: '', result: 'Pending' });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (interviewId) dispatch(fetchInterviewById(interviewId));
    return () => {
      dispatch(clearSelectedInterview());
      dispatch(clearSuccess());
      dispatch(clearInterviewError());
    };
  }, [dispatch, interviewId]);

  useEffect(() => {
    if (interview) {
      setForm({
        feedback: interview.feedback || '',
        score: interview.score !== undefined && interview.score !== null ? interview.score : '',
        result: interview.result || 'Pending',
      });
    }
  }, [interview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'score') {
      const numericVal = value === '' ? '' : Math.min(100, Math.max(0, Number(value)));
      setForm(prev => ({ ...prev, [name]: numericVal, emailType: 'result' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value, emailType: 'result' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(''); setSubmitSuccess(false);
    try {
      await dispatch(updateInterview({ id: interviewId, data: form })).unwrap();
      setSubmitSuccess(true);
      setTimeout(() => navigate(-1), 2000); // Auto-redirect after success
    } catch (err) {
      setSubmitError(err || 'Failed to update interview feedback');
    }
  };

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition";

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 bg-slate-50">Loading evaluation form...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500 bg-slate-50">Error loading details.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Candidate Evaluation</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Submit your final assessment and hiring decision.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 border border-slate-100">
          
          {submitError && <div className="p-4 bg-red-50 text-red-600 rounded-lg font-bold mb-6 text-center">{submitError}</div>}
          {submitSuccess && <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg font-bold mb-6 text-center">Evaluation submitted! Redirecting...</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-bold text-slate-700">Interview Result</label>
                <select name="result" value={form.result} onChange={handleChange} required className={inputClass}>
                  <option value="Pending">Pending</option>
                  <option value="Shortlisted">Shortlisted (Next Round)</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Selected">Selected (Hired)</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-bold text-slate-700">Score (0-100)</label>
                <input type="number" name="score" min={0} max={100} value={form.score} onChange={handleChange} required placeholder="e.g. 85" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-bold text-slate-700">Detailed Feedback</label>
              <textarea name="feedback" value={form.feedback} onChange={handleChange} rows={5} required placeholder="Provide specific feedback on the candidate's technical skills, communication, and cultural fit..." className={`${inputClass} resize-y`} />
            </div>

            <div className="pt-4">
              <button type="submit" disabled={submitSuccess} className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition transform hover:-translate-y-0.5 ${submitSuccess ? 'bg-emerald-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {submitSuccess ? 'Submitted ✓' : 'Submit Final Evaluation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedbackForm;