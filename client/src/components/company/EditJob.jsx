import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchJobById, resetJobState, selectJobsError, selectJobsLoading, selectSelectedJob, updateJob } from "../../slices/jobSlice";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const EditJob = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const job = useSelector(selectSelectedJob);
  const loading = useSelector(selectJobsLoading);
  const error = useSelector(selectJobsError);
 
  const [form, setForm] = useState({
    title: "", description: "", location: "", salary: "", skillsRequired: [], applicationDeadline: "",
  });

  useEffect(() => {
    dispatch(fetchJobById(jobId));
    return () => dispatch(resetJobState());
  }, [dispatch, jobId]);

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "", description: job.description || "", location: job.location || "", salary: job.salary || "",
        skillsRequired: job.skillsRequired || [],
        applicationDeadline: job.applicationDeadline ? job.applicationDeadline.slice(0, 10) : "",
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setForm((prev) => ({ ...prev, skillsRequired: e.target.value.split(",").map((skill) => skill.trim()) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateJob({ id: jobId, data: form })).then((res) => {
      if (!res.error) {
        toast.success("Job updated successfully!");
        navigate("/company/companyJobs"); 
      }
    });
  };

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition";

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading job details...</div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate("/company/companyJobs")} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Back to Jobs
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Edit Job Posting</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Update the details and requirements for this role.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-bold text-slate-700">Job Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-bold text-slate-700">Location</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block mb-2 font-bold text-slate-700">Salary</label>
                <input type="text" name="salary" value={form.salary} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-bold text-slate-700">Skills Required (comma separated)</label>
                <input type="text" name="skillsRequired" value={form.skillsRequired.join(", ")} onChange={handleSkillsChange} className={inputClass} />
              </div>
              <div>
                <label className="block mb-2 font-bold text-slate-700">Application Deadline</label>
                <input type="date" name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-bold text-slate-700">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={5} className={`${inputClass} resize-y`} />
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
              <button type="button" onClick={() => navigate("/company/companyJobs")} className="px-8 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition w-1/3">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-0.5 w-2/3">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;