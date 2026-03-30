import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

Modal.setAppElement('#root');

const InterviewModal = ({ isOpen, onClose, onSubmit, jobs, userCompanyId, initialData = null, mode, fetchCandidatesForJob, candidates, setCandidates = () => { }, selectedCandidate, setSelectedCandidate, user, }) => {
  const [selectedJob, setSelectedJob] = useState('');
  const [form, setForm] = useState({ startTime: '', durationMinutes: 30, interviewType: 'Online', location: '', round: 'Round 1', attachments: [], reminder: [] });
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ startTime: '', newAttachmentUrl: '' });
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setSelectedJob(initialData.job); setSelectedCandidate(initialData.candidate);
      setForm({
        startTime: initialData.startTime ? new Date(initialData.startTime).toISOString().substring(0, 16) : '',
        durationMinutes: initialData.durationMinutes || 30, interviewType: initialData.interviewType || 'Online',
        location: initialData.location || '', round: initialData.round || 'Round 1', attachments: initialData.attachments || [], reminder: initialData.reminder || [],
      });
      setFormError(''); setFieldErrors({ startTime: '', newAttachmentUrl: '' });
      fetchCandidatesForJob(initialData.job);
    } else {
      setSelectedJob(''); setSelectedCandidate('');
      setForm({ startTime: '', durationMinutes: 30, interviewType: 'Online', location: '', round: 'Round 1', attachments: [], reminder: [] });
      setFormError(''); setFieldErrors({ startTime: '', newAttachmentUrl: '' }); setCandidates([]);
    }
  }, [mode, initialData, fetchCandidatesForJob, setCandidates, setSelectedCandidate]);

  const validateDateTime = (value) => {
    if (!value) return 'Interview date and time is required.';
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date format.';
    if (date < new Date()) return 'Date cannot be in the past.';
    return '';
  };

  const validateUrl = (value) => {
    if (!value.trim()) return "";
    try { new URL(value); return ""; } catch { return "Invalid URL."; }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'candidate') setSelectedCandidate(value);
    else if (type === 'checkbox') setForm((prev) => ({ ...prev, [name]: checked }));
    else {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (name === 'startTime') setFieldErrors((prev) => ({ ...prev, startTime: validateDateTime(value) }));
    }
  };

  const handleJobChange = (e) => {
    const jobId = e.target.value;
    setSelectedJob(jobId); setSelectedCandidate(''); fetchCandidatesForJob(jobId);
  };

  const canAddAttachment = newAttachmentUrl.trim() !== '' && newAttachmentName.trim() !== '' && !fieldErrors.newAttachmentUrl;

  const handleAddAttachment = () => {
    if (!canAddAttachment) return;
    setForm((prev) => ({ ...prev, attachments: [...prev.attachments, { url: newAttachmentUrl, name: newAttachmentName }] }));
    setNewAttachmentUrl(''); setNewAttachmentName(''); setFieldErrors((prev) => ({ ...prev, newAttachmentUrl: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fieldErrors.startTime) return setFormError(fieldErrors.startTime);
    if (!selectedJob || !selectedCandidate || !form.startTime) return setFormError('Please fill all required primary fields.');
    if ((form.interviewType === 'Offline' || form.interviewType === 'Hybrid') && !form.location.trim()) return setFormError('Location required for offline/hybrid.');
    
    setFormError('');
    const start = new Date(form.startTime);
    const end = new Date(start.getTime() + form.durationMinutes * 60000);
    
    onSubmit({
      job: selectedJob, candidate: selectedCandidate, startTime: start.toISOString(), endTime: end.toISOString(), interviewDate: start.toISOString(),
      durationMinutes: Number(form.durationMinutes), interviewType: form.interviewType,
      location: form.interviewType === 'Offline' || form.interviewType === 'Hybrid' ? form.location : '',
      round: form.round, attachments: form.attachments.length ? form.attachments : undefined,
      reminder: form.reminder.length ? form.reminder : undefined, interviewers: user._id,
    });
  };

  const inputClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-slate-700 font-medium";

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 outline-none mx-4 my-auto mt-10"
      overlayClassName="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto pt-10"
    >
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-2xl font-bold text-slate-800">{mode === 'create' ? 'Schedule Interview' : 'Edit Interview'}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-red-500 text-3xl font-bold leading-none transition">&times;</button>
      </div>

      {formError && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg font-bold text-center">{formError}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-bold text-slate-700">Target Job</label>
            <select value={selectedJob} onChange={handleJobChange} required className={inputClass}>
              <option value="">Select Job Role</option>
              {jobs.filter((job) => job.company === userCompanyId).map((job) => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-bold text-slate-700">Candidate</label>
            <select value={selectedCandidate} onChange={handleChange} required disabled={!candidates.length} name="candidate" className={inputClass}>
              <option value="">{candidates.length ? "Select Candidate" : "No Shortlisted Candidates"}</option>
              {candidates.map((app, index) => (
                <option key={app.candidate._id + '-' + index} value={app.candidate._id}>{app.candidate.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div>
            <label className="block mb-2 font-bold text-slate-700">Date & Time</label>
            <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required className={`${inputClass} bg-white ${fieldErrors.startTime ? 'border-red-500' : ''}`} />
            {fieldErrors.startTime && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.startTime}</p>}
          </div>
          <div>
            <label className="block mb-2 font-bold text-slate-700">Duration (Mins)</label>
            <input type="number" name="durationMinutes" value={form.durationMinutes} min={1} onChange={handleChange} className={`${inputClass} bg-white`} />
          </div>
          <div>
            <label className="block mb-2 font-bold text-slate-700">Interview Mode</label>
            <select name="interviewType" value={form.interviewType} onChange={handleChange} className={`${inputClass} bg-white`}>
              <option value="Online">Online Video Call</option>
              <option value="Offline">In-Person</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-bold text-slate-700">Round</label>
            <input type="text" name="round" value={form.round} onChange={handleChange} placeholder="e.g. Technical Round 1" className={`${inputClass} bg-white`} />
          </div>
        </div>

        {(form.interviewType === 'Offline' || form.interviewType === 'Hybrid') && (
          <div>
            <label className="block mb-2 font-bold text-slate-700">Physical Location</label>
            <input name="location" value={form.location} onChange={handleChange} required placeholder="Building, Floor, Room No." className={inputClass} />
          </div>
        )}

        {/* Resources & Buttons */}
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-4 mt-8">
          <button type="button" onClick={onClose} className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition w-32">
            Cancel
          </button>
          <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:-translate-y-0.5 transition transform">
            {mode === 'create' ? 'Schedule Interview' : 'Save Updates'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InterviewModal;