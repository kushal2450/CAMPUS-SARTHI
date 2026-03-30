import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createApplication } from '../../slices/applicationSlice';
import { selectAuthUser } from '../../slices/authSlice';
import { selectJobs } from '../../slices/jobSlice';

const StudentApplicationForm = ({ jobs = [] }) => {
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch();
  const job = useSelector(selectJobs);

  const [form, setForm] = useState({
    jobId: '', candidate: '', company: '', resume: null, coverLetter: '', status: '',
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    dispatch(createApplication(formData));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-extrabold text-slate-800 mb-6 text-center">Quick Apply</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Full Name" required 
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" />
        
        <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email Address" required 
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" />
        
        <input name="phone" value={form.phone} onChange={handleChange} type="text" placeholder="Phone Number" required 
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" />

        <select name="jobId" value={form.jobId} onChange={handleChange} required 
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition">
          <option value="">Select Job/Drive</option>
          {jobs.map((j) => (
            <option value={j._id} key={j._id}>{j.title}</option>
          ))}
        </select>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm">
          <label className="block text-slate-700 font-bold mb-2">Upload Resume</label>
          <input name="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleChange} required 
            className="w-full text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer" />
        </div>

        <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} placeholder="Brief Cover Letter" rows={4} required 
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition resize-y" />

        <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md hover:-translate-y-0.5 mt-2">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default StudentApplicationForm;