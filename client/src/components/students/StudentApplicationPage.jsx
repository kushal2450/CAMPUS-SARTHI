import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { selectAuthUser } from "../../slices/authSlice";
import { fetchStudents, selectStudents, uploadStudentResume } from "../../slices/studentSlice";
import { createApplication, fetchMyApplications } from "../../slices/applicationSlice";

const StudentApplicationPage = () => {
  const dispatch = useDispatch();
  const { driveId, companyId, jobId } = useParams();
  const user = useSelector(selectAuthUser);
  const students = useSelector(selectStudents);
  const userId = user?._id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    resume: "",
    coverLetter: "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const [resumeError, setResumeError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const currentStudentProfile = students.find((student) => student.userId === userId);

  useEffect(() => {
    if (currentStudentProfile?.resume) {
      setForm((prev) => ({ ...prev, resume: currentStudentProfile.resume }));
    }
  }, [currentStudentProfile]);

  useEffect(() => {
    const checkDuplicateApplication = async () => {
      if (userId && jobId && companyId) {
        try {
          const action = await dispatch(fetchMyApplications()).unwrap();
          const duplicate = action.find(
            (app) => app.job._id === jobId && app.company._id === companyId
          );
          setAlreadyApplied(!!duplicate);
        } catch {
          setAlreadyApplied(false);
        }
      }
    };
    checkDuplicateApplication();
  }, [dispatch, userId, jobId, companyId]);

  const validateResumeUrl = (url) => !!url && (url.startsWith("http") || url.startsWith("blob"));

  const validatePhone = (phone) => {
    const onlyDigits = phone.replace(/\D/g, "");
    return onlyDigits.length === 10;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "resume") setResumeError("");
    if (name === "phone") {
      if (!validatePhone(value)) setPhoneError("Phone number must contain exactly 10 digits");
      else setPhoneError("");
    }
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const action = await dispatch(uploadStudentResume({ file }));
      if (uploadStudentResume.fulfilled.match(action)) {
        setForm((prev) => ({ ...prev, resume: action.payload }));
        setResumeError("");
        toast.success("Resume uploaded successfully!");
      } else {
        toast.error("Resume upload failed: " + action.payload);
      }
    } catch (error) {
      toast.error("Unexpected error uploading resume: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (alreadyApplied) {
      toast.error("You have already applied for this job role at this company.");
      return;
    }
    if (!form.resume || !validateResumeUrl(form.resume)) {
      setResumeError("Please provide or upload a valid resume file.");
      toast.error("Resume file required.");
      return;
    }
    if (!validatePhone(form.phone)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      toast.error("Invalid phone number.");
      return;
    }

    setPhoneError("");

    const payload = {
      job: jobId,
      company: companyId,
      candidate: userId,
      resume: form.resume,
      coverletter: form.coverLetter,
      name: form.name,
      email: form.email,
      phone: form.phone,
      placementDriveId: driveId,
    };

    dispatch(createApplication(payload));
    toast.success("Application submitted successfully!");
    setForm((prev) => ({ ...prev, resume: currentStudentProfile?.resume || "", coverLetter: "" }));
    navigate(`/student/dashboard`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button
          onClick={() => navigate(`/student/applyJob/${driveId}/${companyId}`)}
          className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Job Application</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Submit your details and resume for this opportunity.</p>
        </div>
      </div>

      {/* Floating Form Card */}
      <div className="max-w-3xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 border border-slate-100">
          {alreadyApplied ? (
            <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100">
              <span className="text-4xl mb-3 block">⚠️</span>
              <p className="text-red-600 font-bold text-lg">You have already applied for this job role at this company.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-bold text-slate-700">Full Name</label>
                  <input id="name" type="text" name="name" value={form.name} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 font-bold text-slate-700">Email Address</label>
                  <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block mb-2 font-bold text-slate-700">Phone Number</label>
                <input id="phone" type="text" name="phone" value={form.phone} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                {phoneError && <p className="text-red-500 text-sm mt-1 font-medium">{phoneError}</p>}
              </div>

              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-3">📄</span>
                <label htmlFor="resumeFile" className="block mb-2 font-bold text-slate-800 text-lg">Update Resume? (Optional)</label>
                <input id="resumeFile" name="resumeFile" type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleResumeUpload(e.target.files[0])} disabled={uploading} className="w-full max-w-sm p-2 bg-white border border-slate-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                {form.resume && (
                  <a href={form.resume} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-bold text-indigo-600 hover:text-indigo-800 underline">
                    View Currently Attached Resume
                  </a>
                )}
                {resumeError && <p className="text-red-500 text-sm mt-2 font-medium">{resumeError}</p>}
              </div>

              <div>
                <label htmlFor="coverLetter" className="block mb-2 font-bold text-slate-700">Cover Letter</label>
                <textarea id="coverLetter" name="coverLetter" value={form.coverLetter} onChange={handleChange} rows={5} placeholder="Why are you a good fit for this role?" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl resize-y focus:ring-2 focus:ring-indigo-500 outline-none transition" />
              </div>

              <button type="submit" disabled={uploading} className={`w-full py-4 rounded-xl text-white font-bold text-lg transition shadow-lg hover:-translate-y-1 ${uploading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                {uploading ? "Uploading..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentApplicationPage;