import { useDispatch, useSelector } from 'react-redux';
import { createInterview, deleteInterview, fetchInterviews, selectAllInterviews, selectInterviewError, selectInterviewLoading, updateInterview } from '../../slices/interviewSlice';
import { fetchJobs, selectJobs } from '../../slices/jobSlice';
import { fetchUsers, selectUsers } from '../../slices/authSlice';
import { useEffect, useState, useCallback } from 'react';
import InterviewModal from './InterviewModal';
import { useNavigate } from 'react-router';
import applicationApi from '../../api/applicationsApi';
import { FaArrowLeft } from "react-icons/fa";
import toast from 'react-hot-toast';

const InterviewSchedulingForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const interviews = useSelector(selectAllInterviews);
  const isLoading = useSelector(selectInterviewLoading);
  const isError = useSelector(selectInterviewError);
  const jobs = useSelector(selectJobs);
  const user = useSelector((state) => state.auth.user);
  const users = useSelector(selectUsers);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingInterviewId, setEditingInterviewId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchInterviews());
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredJobsId = jobs?.filter((job) => job.company === user.companyId).map((job) => job._id) || [];
  const companyInterviews = interviews?.filter((iv) => filteredJobsId.includes(iv.job)) || [];

  const getCandidateName = (candidateId) => users.find((u) => u._id === candidateId)?.name || 'N/A';
  const getJobTitle = (jobId) => jobs.find((j) => j._id === jobId)?.title || 'N/A';

  const fetchCandidatesForJob = useCallback((jobId) => {
    if (!jobId) { setCandidates([]); setSelectedCandidate(''); return; }
    applicationApi.getCompanyApplications({ jobId, status: 'Shortlisted' })
      .then((res) => setCandidates(res.data.data)).catch(() => setCandidates([]));
  }, []);

  const openCreateModal = () => { setModalMode('create'); setEditingInterviewId(null); setSelectedCandidate(''); setCandidates([]); setModalIsOpen(true); };
  const openEditModal = (interview) => { setModalMode('edit'); setEditingInterviewId(interview._id); setSelectedCandidate(interview.candidate); fetchCandidatesForJob(interview.job); setModalIsOpen(true); };

  const handleSubmit = async (data) => {
    try {
      if (modalMode === 'create') await dispatch(createInterview(data)).unwrap();
      else if (modalMode === 'edit' && editingInterviewId) await dispatch(updateInterview({ id: editingInterviewId, data })).unwrap();
      dispatch(fetchInterviews());
      setModalIsOpen(false);
      toast.success(modalMode === 'create' ? 'Interview scheduled!' : 'Interview updated!');
    } catch (error) { toast.error(error || 'Failed to save interview'); }
  };

  const handleDeleteInterview = async (id) => {
    if (!window.confirm('Delete this interview permanently?')) return;
    try {
      await dispatch(deleteInterview(id)).unwrap();
      dispatch(fetchInterviews());
      toast.success("Interview removed.");
    } catch (error) { toast.error(error || 'Failed to delete interview.'); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate('/companyDashboard')} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Dashboard
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Interview Schedule</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Manage your upcoming technical and HR rounds.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
            <h2 className="text-2xl font-bold text-slate-800">Scheduled Interviews</h2>
            <button onClick={openCreateModal} className="bg-indigo-600 text-white rounded-xl px-6 py-3 font-bold hover:bg-indigo-700 shadow-lg hover:-translate-y-0.5 transition transform">
              + Schedule New
            </button>
          </div>

          {isLoading && <p className="text-center font-bold text-slate-500 py-10">Loading schedule...</p>}
          {isError && <p className="text-center font-bold text-red-500 py-10">Error loading data.</p>}

          {!isLoading && !isError && (
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {companyInterviews.length === 0 ? (
                    <tr><td colSpan="5" className="text-center p-8 text-slate-500 font-medium">No interviews scheduled yet.</td></tr>
                  ) : (
                    companyInterviews.map((interview) => (
                      <tr key={interview._id} onClick={() => navigate(`/company/interview/${interview._id}`)} className="hover:bg-indigo-50 cursor-pointer transition">
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">{getCandidateName(interview.candidate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">{getJobTitle(interview.job)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">{new Date(interview.interviewDate).toLocaleString()} <span className="text-xs ml-2 bg-slate-200 px-2 py-1 rounded text-slate-700">{interview.interviewType}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            interview.status === "Scheduled" ? "bg-blue-100 text-blue-700" :
                            interview.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                          }`}>{interview.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button onClick={(e) => { e.stopPropagation(); openEditModal(interview); }} className="text-indigo-600 font-bold hover:underline mr-4">Edit</button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteInterview(interview._id); }} className="text-red-500 font-bold hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <InterviewModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} onSubmit={handleSubmit} jobs={jobs} userCompanyId={user.companyId} initialData={modalMode === 'edit' ? companyInterviews.find((iv) => iv._id === editingInterviewId) : null} mode={modalMode} fetchCandidatesForJob={fetchCandidatesForJob} candidates={candidates} setCandidates={setCandidates} selectedCandidate={selectedCandidate} setSelectedCandidate={setSelectedCandidate} user={user} />
    </div>
  );
};

export default InterviewSchedulingForm;