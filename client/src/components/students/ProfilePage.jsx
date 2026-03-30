import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../../slices/authSlice";
import {
  createStudent,
  selectStudentLoading,
  selectStudentError,
  uploadStudentResume,
} from "../../slices/studentSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectStudentLoading);
  const error = useSelector(selectStudentError);
  const navigate = useNavigate();

  const initialState = {
    userId: user?._id,
    name: "",
    email: "",
    phone: "",
    bio: "",
    education: [{ institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" }],
    experience: [{ company: "", role: "", startDate: "", endDate: "", description: "" }],
    skills: [""],
    portfolioLinks: [""],
    resume: "",
  };

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        userId: user._id,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // Validation helpers (UNCHANGED LOGIC)
  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format.";
    return "";
  };

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, "");
    if (!phone.trim()) return "Phone number is required.";
    if (digits.length !== 10) return "Phone number must have exactly 10 digits.";
    return "";
  };

  const validateEducationYear = (startYear, endYear) => {
    const errors = {};
    const currentYear = new Date().getFullYear();
    if (startYear) {
      const syNum = Number(startYear);
      if (isNaN(syNum) || syNum < 1900 || syNum > currentYear) errors.startYear = "Start Year must be a valid year.";
    }
    if (endYear) {
      const eyNum = Number(endYear);
      if (isNaN(eyNum) || eyNum < 1900 || eyNum > currentYear + 10) errors.endYear = "End Year must be a valid year.";
    }
    if (startYear && endYear && Number(startYear) > Number(endYear)) errors.yearOrder = "Start Year cannot be greater than End Year.";
    return errors;
  };

  const validateExperienceDates = (startDate, endDate) => {
    const errors = {};
    const isValidDate = (d) => !d || !isNaN(new Date(d).getTime());
    if (!isValidDate(startDate)) errors.startDate = "Start Date is invalid.";
    if (!isValidDate(endDate)) errors.endDate = "End Date is invalid.";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) errors.dateOrder = "Start Date cannot be after End Date.";
    return errors;
  };

  const validateUrl = (value) => {
    if (!value.trim()) return ""; 
    try { new URL(value); return ""; } catch { return "Invalid URL format."; }
  };

  // Handlers (UNCHANGED LOGIC)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    let errorMsg = "";
    if (name === "email") errorMsg = validateEmail(value);
    else if (name === "phone") errorMsg = validatePhone(value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setForm((prev) => {
      const newArray = [...prev[field]];
      if (key) newArray[index] = { ...newArray[index], [key]: value };
      else newArray[index] = value;
      return { ...prev, [field]: newArray };
    });

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (field === "education" && key && (key === "startYear" || key === "endYear")) {
        const edu = form.education[index];
        const eduErrors = validateEducationYear(key === "startYear" ? value : edu.startYear, key === "endYear" ? value : edu.endYear);
        delete newErrors[`education_startYear_${index}`];
        delete newErrors[`education_endYear_${index}`];
        delete newErrors[`education_yearOrder_${index}`];
        Object.assign(newErrors, { [`education_startYear_${index}`]: eduErrors.startYear, [`education_endYear_${index}`]: eduErrors.endYear, [`education_yearOrder_${index}`]: eduErrors.yearOrder });
      }
      if (field === "experience" && key && (key === "startDate" || key === "endDate")) {
        const exp = form.experience[index];
        const expErrors = validateExperienceDates(key === "startDate" ? value : exp.startDate, key === "endDate" ? value : exp.endDate);
        delete newErrors[`experience_startDate_${index}`];
        delete newErrors[`experience_endDate_${index}`];
        delete newErrors[`experience_dateOrder_${index}`];
        Object.assign(newErrors, { [`experience_startDate_${index}`]: expErrors.startDate, [`experience_endDate_${index}`]: expErrors.endDate, [`experience_dateOrder_${index}`]: expErrors.dateOrder });
      }
      if (field === "portfolioLinks" && !key) {
        const error = validateUrl(value);
        if (error) newErrors[`portfolioLinks_${index}`] = error;
        else delete newErrors[`portfolioLinks_${index}`];
      }
      return newErrors;
    });
  };

  const addItem = (field) => {
    setForm((prev) => {
      let newItem = field === "education" ? { institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" } :
                    field === "experience" ? { company: "", role: "", startDate: "", endDate: "", description: "" } : "";
      return { ...prev, [field]: [...prev[field], newItem] };
    });
  };

  const removeItem = (field, index) => {
    setForm((prev) => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray.length ? newArray : [""] };
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => { if (key.includes(`${field}_`) && key.includes(`_${index}`)) delete newErrors[key]; });
      return newErrors;
    });
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;
    try {
      const action = await dispatch(uploadStudentResume({ file }));
      if (uploadStudentResume.fulfilled.match(action)) {
        setForm((prev) => ({ ...prev, resume: action.payload }));
        toast.success("Resume uploaded successfully!");
        setErrors((prev) => ({ ...prev, resume: "" }));
      } else toast.error("Resume upload failed: " + action.payload);
    } catch (error) { toast.error("Unexpected error: " + error.message); }
  };

  const validateForm = () => {
    const newErrors = {};
    if (validateEmail(form.email)) newErrors.email = validateEmail(form.email);
    if (validatePhone(form.phone)) newErrors.phone = validatePhone(form.phone);
    form.education.forEach((edu, idx) => {
      const e = validateEducationYear(edu.startYear, edu.endYear);
      if(e.startYear) newErrors[`education_startYear_${idx}`] = e.startYear;
      if(e.endYear) newErrors[`education_endYear_${idx}`] = e.endYear;
      if(e.yearOrder) newErrors[`education_yearOrder_${idx}`] = e.yearOrder;
    });
    form.experience.forEach((exp, idx) => {
      const e = validateExperienceDates(exp.startDate, exp.endDate);
      if(e.startDate) newErrors[`experience_startDate_${idx}`] = e.startDate;
      if(e.endDate) newErrors[`experience_endDate_${idx}`] = e.endDate;
      if(e.dateOrder) newErrors[`experience_dateOrder_${idx}`] = e.dateOrder;
    });
    form.portfolioLinks.forEach((link, i) => {
      const error = validateUrl(link);
      if (error) newErrors[`portfolioLinks_${i}`] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return toast.error("Please fix the errors in the form.");
    const payload = {
      userId: form.userId,
      bio: form.bio,
      education: form.education,
      experience: form.experience,
      skills: form.skills.filter((s) => s.trim() !== ""),
      portfolioLinks: form.portfolioLinks.filter((l) => l.trim() !== ""),
      resume: form.resume.trim(),
    };
    dispatch(createStudent(payload));
    toast.success("Profile created successfully!");
    navigate("/student/dashboard");
    setForm(initialState);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      {/* 1. Gradient Header with Glassmorphism Back Button */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button
          onClick={() => navigate(`/student/dashboard`)}
          className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm"
          aria-label="Go Back"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Create Your Profile</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">
            Set up your academic and professional portfolio to start applying to companies.
          </p>
        </div>
      </div>

      {/* 2. Floating Form Card */}
      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 border border-slate-100">
          
          {loading && <div className="p-4 bg-indigo-50 text-indigo-700 rounded-lg text-center font-bold mb-6">Processing...</div>}
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center font-bold mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-bold text-slate-700">Full Name</label>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition" />
                {errors.name && <p className="text-red-500 text-sm mt-1 font-medium">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-bold text-slate-700">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition" />
                {errors.email && <p className="text-red-500 text-sm mt-1 font-medium">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block mb-2 font-bold text-slate-700">Phone Number</label>
              <input id="phone" name="phone" type="text" value={form.phone} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition" />
              {errors.phone && <p className="text-red-500 text-sm mt-1 font-medium">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="bio" className="block mb-2 font-bold text-slate-700">Professional Bio</label>
              <textarea id="bio" name="bio" value={form.bio} onChange={handleChange} rows={4} maxLength={500} placeholder="Write a short bio (max 500 characters)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition" />
              {errors.bio && <p className="text-red-500 text-sm mt-1 font-medium">{errors.bio}</p>}
            </div>

            {/* Education Section */}
            <fieldset className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
              <legend className="font-bold text-xl text-slate-800 px-3">Education</legend>
              {form.education.map((edu, i) => (
                <div key={i} className="mb-6 last:mb-0 border-b border-slate-200 last:border-0 pb-6 last:pb-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => handleArrayChange("education", i, "institution", e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <input type="text" placeholder="Degree (e.g. B.Tech)" value={edu.degree} onChange={(e) => handleArrayChange("education", i, "degree", e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <input type="text" placeholder="Field Of Study" value={edu.fieldOfStudy} onChange={(e) => handleArrayChange("education", i, "fieldOfStudy", e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input type="number" placeholder="Start Year" value={edu.startYear} onChange={(e) => handleArrayChange("education", i, "startYear", e.target.value)} min="1900" max={new Date().getFullYear()} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                      {errors[`education_startYear_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`education_startYear_${i}`]}</p>}
                    </div>
                    <div>
                      <input type="number" placeholder="End Year" value={edu.endYear} onChange={(e) => handleArrayChange("education", i, "endYear", e.target.value)} min="1900" max={new Date().getFullYear() + 10} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                      {errors[`education_endYear_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`education_endYear_${i}`]}</p>}
                    </div>
                  </div>
                  {errors[`education_yearOrder_${i}`] && <p className="text-red-500 text-xs">{errors[`education_yearOrder_${i}`]}</p>}
                  <button type="button" className="text-red-500 font-semibold text-sm hover:underline" onClick={() => removeItem("education", i)} disabled={form.education.length === 1}>Remove Education Entry</button>
                </div>
              ))}
              <button type="button" className="text-indigo-600 font-bold text-sm hover:underline mt-2" onClick={() => addItem("education")}>+ Add Another Education</button>
            </fieldset>

            {/* Experience Section */}
            <fieldset className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
              <legend className="font-bold text-xl text-slate-800 px-3">Experience</legend>
              {form.experience.map((exp, i) => (
                <div key={i} className="mb-6 last:mb-0 border-b border-slate-200 last:border-0 pb-6 last:pb-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Company Name" value={exp.company} onChange={(e) => handleArrayChange("experience", i, "company", e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <input type="text" placeholder="Role (e.g. Intern)" value={exp.role} onChange={(e) => handleArrayChange("experience", i, "role", e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input type="date" placeholder="Start Date" value={exp.startDate ? exp.startDate.slice(0, 10) : ""} onChange={(e) => handleArrayChange("experience", i, "startDate", e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600" />
                      {errors[`experience_startDate_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`experience_startDate_${i}`]}</p>}
                    </div>
                    <div>
                      <input type="date" placeholder="End Date" value={exp.endDate ? exp.endDate.slice(0, 10) : ""} onChange={(e) => handleArrayChange("experience", i, "endDate", e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600" />
                      {errors[`experience_endDate_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`experience_endDate_${i}`]}</p>}
                    </div>
                  </div>
                  {errors[`experience_dateOrder_${i}`] && <p className="text-red-500 text-xs">{errors[`experience_dateOrder_${i}`]}</p>}
                  <textarea placeholder="Description of your responsibilities" value={exp.description} onChange={(e) => handleArrayChange("experience", i, "description", e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg resize-y focus:ring-2 focus:ring-indigo-500 outline-none" rows={3} />
                  <button type="button" className="text-red-500 font-semibold text-sm hover:underline" onClick={() => removeItem("experience", i)} disabled={form.experience.length === 1}>Remove Experience Entry</button>
                </div>
              ))}
              <button type="button" className="text-indigo-600 font-bold text-sm hover:underline mt-2" onClick={() => addItem("experience")}>+ Add Another Experience</button>
            </fieldset>

            {/* Skills & Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <fieldset className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
                <legend className="font-bold text-xl text-slate-800 px-3">Skills</legend>
                {form.skills.map((skill, i) => (
                  <div key={i} className="flex items-center space-x-2 mb-3">
                    <input type="text" placeholder="e.g. React, Python" value={skill} onChange={(e) => handleArrayChange("skills", i, null, e.target.value)} className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <button type="button" className="text-slate-400 hover:text-red-500 p-2" onClick={() => removeItem("skills", i)} disabled={form.skills.length === 1}>✖</button>
                  </div>
                ))}
                <button type="button" className="text-indigo-600 font-bold text-sm hover:underline mt-1" onClick={() => addItem("skills")}>+ Add Skill</button>
              </fieldset>

              <fieldset className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
                <legend className="font-bold text-xl text-slate-800 px-3">Portfolio Links</legend>
                {form.portfolioLinks.map((link, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex items-center space-x-2">
                      <input type="url" placeholder="https://github.com/..." value={link} onChange={(e) => handleArrayChange("portfolioLinks", i, null, e.target.value)} className={`flex-1 p-3 border rounded-lg outline-none transition ${errors[`portfolioLinks_${i}`] ? "border-red-500 focus:ring-2 focus:ring-red-400" : "border-slate-200 focus:ring-2 focus:ring-indigo-500"}`} />
                      <button type="button" className="text-slate-400 hover:text-red-500 p-2" onClick={() => removeItem("portfolioLinks", i)} disabled={form.portfolioLinks.length === 1}>✖</button>
                    </div>
                    {errors[`portfolioLinks_${i}`] && <p className="text-red-500 text-xs ml-1 mt-1">{errors[`portfolioLinks_${i}`]}</p>}
                  </div>
                ))}
                <button type="button" className="text-indigo-600 font-bold text-sm hover:underline mt-1" onClick={() => addItem("portfolioLinks")}>+ Add Link</button>
              </fieldset>
            </div>

            {/* Resume Upload */}
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-3">📄</span>
              <label htmlFor="resumeFile" className="block mb-2 font-bold text-slate-800 text-lg">Upload Resume</label>
              <p className="text-slate-500 text-sm mb-4">Accepted formats: PDF, DOC, DOCX</p>
              <input id="resumeFile" name="resumeFile" type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleResumeUpload(e.target.files[0])} className="w-full max-w-sm p-2 bg-white border border-slate-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              {form.resume && (
                <a href={form.resume} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-bold text-indigo-600 hover:text-indigo-800 underline">
                  View Currently Uploaded Resume
                </a>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className={`w-full py-4 text-white rounded-xl font-bold text-lg shadow-lg transition transform hover:-translate-y-1 ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
              {loading ? "Saving Profile..." : "Save Profile"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;