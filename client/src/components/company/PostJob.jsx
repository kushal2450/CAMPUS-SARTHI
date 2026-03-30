import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";
import { selectAuthUser } from "../../slices/authSlice";
import { clearJobError, createJob, resetJobState, selectJobsError, selectJobsLoading, selectJobsSuccess } from "../../slices/jobSlice";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectJobsLoading);
  const error = useSelector(selectJobsError);
  const isSuccess = useSelector(selectJobsSuccess);
  const companies = useSelector(selectAllCompanies);
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const userId = user?._id;
  const companyId = companies.filter((c) => c.user === userId).map((c) => c._id)[0] || "";

  const { placementDriveId } = useParams();

  const [formData, setFormData] = useState({
    placementDrive: "", company: "", title: "", description: "", location: "", salary: "", skillsRequired: [], openings: 1, applicationDeadline: "",
  });

  const [deadlineError, setDeadlineError] = useState("");

  useEffect(() => {
    setFormData((prev) => ({ ...prev, placementDrive: placementDriveId || "", company: companyId }));
  }, [placementDriveId, companyId]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetJobState());
      setFormData({ placementDrive: placementDriveId || "", company: companyId, title: "", description: "", location: "", salary: "", skillsRequired: [], openings: 1, applicationDeadline: "" });
      setDeadlineError("");
    }
    return () => { dispatch(clearJobError()); };
  }, [isSuccess, dispatch, placementDriveId, companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "applicationDeadline") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setDeadlineError("");
      if (value) {
        const deadline = new Date(value);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (isNaN(deadline.getTime())) setDeadlineError("Please enter a valid date.");
        else if (deadline <= now) setDeadlineError("Date must be in the future.");
      }
      if (error) dispatch(clearJobError());
      return;
    }

    if (name === "skillsRequired") {
      const skillsArray = value.split(",").map((skill) => skill.trim()).filter(Boolean);
      setFormData((prev) => ({ ...prev, skillsRequired: skillsArray }));
    } else if (name === "openings") {
      const num = parseInt(value, 10);
      setFormData((prev) => ({ ...prev, openings: isNaN(num) ? 1 : num }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (error) dispatch(clearJobError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.applicationDeadline) {
      const deadline = new Date(formData.applicationDeadline);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (isNaN(deadline.getTime())) return setDeadlineError("Please enter a valid date.");
      else if (deadline <= now) return setDeadlineError("Date must be in the future.");
    }
    setDeadlineError("");
    if (!formData.title || !formData.placementDrive) return toast.error("Please fill in all required fields.");

    dispatch(createJob(formData));
    toast.success("Job posted successfully!");
    navigate("/company/dashboard");
  };

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">{placementDriveId ? "Post Job for Drive" : "Create New Job Post"}</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Fill out the requirements to attract top student talent.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 border border-slate-100">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg font-bold mb-6 text-center">{Array.isArray(error) ? error.join(", ") : error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-bold text-slate-700">Job Title <span className="text-red-500">*</span></label>
              <input name="title" type="text" value={formData.title} onChange={handleChange} required placeholder="e.g., Frontend Developer" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-bold text-slate-700">Location</label>
                <input name="location" type="text" value={formData.location} onChange={handleChange} placeholder="e.g., Remote, Bangalore" className={inputClass} />
              </div>
              <div>
                <label className="block mb-2 font-bold text-slate-700">Salary</label>
                <input name="salary" type="text" value={formData.salary} onChange={handleChange} placeholder="e.g., ₹8,00,000 LPA" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-bold text-slate-700">Skills Required <span className="text-slate-400 font-medium text-sm">(comma separated)</span></label>
              <input name="skillsRequired" type="text" value={formData.skillsRequired.join(", ")} onChange={handleChange} placeholder="React, Node.js, MongoDB" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-bold text-slate-700">Number of Openings</label>
                <input name="openings" type="number" min={1} value={formData.openings} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block mb-2 font-bold text-slate-700">Application Deadline</label>
                <input name="applicationDeadline" type="date" value={formData.applicationDeadline} onChange={handleChange} className={`${inputClass} ${deadlineError ? "border-red-500 focus:ring-red-400" : ""}`} />
                {deadlineError && <span className="text-red-500 text-sm mt-1 block font-medium">{deadlineError}</span>}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-bold text-slate-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Provide a detailed job description..." className={`${inputClass} resize-y`} />
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition transform hover:-translate-y-1 ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                {loading ? "Publishing..." : "Publish Job Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;