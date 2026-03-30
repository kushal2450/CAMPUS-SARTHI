import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import { clearSelectedStudent, fetchStudents, selectStudentError, selectStudentLoading, selectStudents, updateStudent } from "../slices/studentSlice";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const ViewProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const students = useSelector(selectStudents);
  const loading = useSelector(selectStudentLoading);
  const error = useSelector(selectStudentError);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    dispatch(fetchStudents());
    return () => dispatch(clearSelectedStudent());
  }, [dispatch]);

  useEffect(() => {
    if (students && user?._id) {
      const student = students.find((stu) => String(stu.userId) === String(user._id));
      setForm(student ? {
        ...student,
        bio: student.bio || "",
        education: student.education?.length ? student.education : [{ institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" }],
        experience: student.experience?.length ? student.experience : [{ company: "", role: "", startDate: "", endDate: "", description: "" }],
        skills: student.skills?.length ? student.skills : [""],
        portfolioLinks: student.portfolioLinks?.length ? student.portfolioLinks : [""],
        resume: student.resume || "",
      } : null);
    }
  }, [students, user]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleArrayChange = (field, idx, key, value) => setForm(prev => { const arr = [...prev[field]]; if (key) arr[idx] = { ...arr[idx], [key]: value }; else arr[idx] = value; return { ...prev, [field]: arr }; });
  
  const addItem = (field) => setForm(prev => {
    let item = field === "education" ? { institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" } :
               field === "experience" ? { company: "", role: "", startDate: "", endDate: "", description: "" } : "";
    return { ...prev, [field]: [...prev[field], item] };
  });

  const removeItem = (field, idx) => setForm(prev => { const arr = [...prev[field]]; arr.splice(idx, 1); return { ...prev, [field]: arr.length ? arr : [""] }; });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form) return;
    dispatch(updateStudent({ id: form._id, data: { ...form, skills: form.skills.filter(s => s.trim()), portfolioLinks: form.portfolioLinks.filter(l => l.trim()) } }));
    setEditMode(false);
    toast.success("Profile updated successfully!");
  };

  const inputClass = "w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition";
  const viewClass = "w-full p-3 bg-slate-50 text-slate-800 font-medium rounded-lg border border-slate-200";

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading profile...</div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-500">{error}</div>;
  if (!form && !loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500 flex-col"><span className="text-4xl mb-4">⚠️</span> Profile not found. Contact Admin.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Dashboard
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">{editMode ? "Edit Profile" : "My Profile"}</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Maintain an up-to-date resume to attract top companies.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 border border-slate-100">
          
          {!editMode && (
            <div className="flex justify-end mb-6">
              <button onClick={() => setEditMode(true)} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 transition">
                Edit Profile
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div><label className="block mb-2 font-bold text-slate-700">Full Name</label><div className={viewClass}>{user?.name}</div></div>
              <div><label className="block mb-2 font-bold text-slate-700">Email</label><div className={viewClass}>{user?.email}</div></div>
            </div>

            <div>
              <label className="block mb-2 font-bold text-slate-700">Professional Bio</label>
              {editMode ? <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className={`${inputClass} resize-y`} /> : <div className={viewClass}>{form.bio || "No bio."}</div>}
            </div>

            {/* Education */}
            <fieldset className="border border-slate-200 p-6 rounded-xl bg-slate-50/50">
              <legend className="font-bold text-lg text-slate-800 px-3">Education</legend>
              {form.education.map((edu, i) => (
                <div key={i} className="mb-6 border-b border-slate-200 pb-6 last:border-0 last:pb-0 last:mb-0">
                  {editMode ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input placeholder="Institution" value={edu.institution} onChange={(e) => handleArrayChange("education", i, "institution", e.target.value)} className={inputClass} />
                        <input placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange("education", i, "degree", e.target.value)} className={inputClass} />
                        <input placeholder="Field of Study" value={edu.fieldOfStudy} onChange={(e) => handleArrayChange("education", i, "fieldOfStudy", e.target.value)} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Start Year" value={edu.startYear} onChange={(e) => handleArrayChange("education", i, "startYear", e.target.value)} className={inputClass} />
                        <input type="number" placeholder="End Year" value={edu.endYear} onChange={(e) => handleArrayChange("education", i, "endYear", e.target.value)} className={inputClass} />
                      </div>
                      <button type="button" onClick={() => removeItem("education", i)} disabled={form.education.length === 1} className="text-red-500 font-bold text-sm hover:underline">Remove</button>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-indigo-700">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                      <p className="text-slate-700 font-medium">{edu.institution} <span className="text-slate-400 text-sm ml-2">({edu.startYear} - {edu.endYear})</span></p>
                    </div>
                  )}
                </div>
              ))}
              {editMode && <button type="button" onClick={() => addItem("education")} className="text-indigo-600 font-bold text-sm mt-4 hover:underline">+ Add Education</button>}
            </fieldset>

            {/* Experience */}
            <fieldset className="border border-slate-200 p-6 rounded-xl bg-slate-50/50">
              <legend className="font-bold text-lg text-slate-800 px-3">Experience</legend>
              {form.experience.map((exp, i) => (
                <div key={i} className="mb-6 border-b border-slate-200 pb-6 last:border-0 last:pb-0 last:mb-0">
                  {editMode ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange("experience", i, "company", e.target.value)} className={inputClass} />
                        <input placeholder="Role" value={exp.role} onChange={(e) => handleArrayChange("experience", i, "role", e.target.value)} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="date" value={exp.startDate ? exp.startDate.slice(0, 10) : ""} onChange={(e) => handleArrayChange("experience", i, "startDate", e.target.value)} className={inputClass} />
                        <input type="date" value={exp.endDate ? exp.endDate.slice(0, 10) : ""} onChange={(e) => handleArrayChange("experience", i, "endDate", e.target.value)} className={inputClass} />
                      </div>
                      <textarea placeholder="Description" rows={3} value={exp.description} onChange={(e) => handleArrayChange("experience", i, "description", e.target.value)} className={inputClass} />
                      <button type="button" onClick={() => removeItem("experience", i)} disabled={form.experience.length === 1} className="text-red-500 font-bold text-sm hover:underline">Remove</button>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-indigo-700">{exp.role} at {exp.company}</p>
                      <p className="text-slate-400 text-sm font-bold mb-2">{exp.startDate?.slice(0, 10)} to {exp.endDate?.slice(0, 10)}</p>
                      <p className="text-slate-700 font-medium whitespace-pre-line">{exp.description}</p>
                    </div>
                  )}
                </div>
              ))}
              {editMode && <button type="button" onClick={() => addItem("experience")} className="text-indigo-600 font-bold text-sm mt-4 hover:underline">+ Add Experience</button>}
            </fieldset>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Skills */}
              <fieldset className="border border-slate-200 p-6 rounded-xl bg-slate-50/50">
                <legend className="font-bold text-lg text-slate-800 px-3">Skills</legend>
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill, i) => editMode ? (
                    <div key={i} className="flex items-center w-full mb-2"><input value={skill} onChange={(e) => handleArrayChange("skills", i, null, e.target.value)} className={inputClass} /><button type="button" onClick={() => removeItem("skills", i)} className="ml-2 text-red-500">✖</button></div>
                  ) : <span key={i} className="bg-white border border-slate-200 text-slate-700 font-bold px-3 py-1 rounded-md">{skill}</span>)}
                </div>
                {editMode && <button type="button" onClick={() => addItem("skills")} className="text-indigo-600 font-bold text-sm mt-4 hover:underline">+ Add Skill</button>}
              </fieldset>

              {/* Links */}
              <fieldset className="border border-slate-200 p-6 rounded-xl bg-slate-50/50">
                <legend className="font-bold text-lg text-slate-800 px-3">Portfolio Links</legend>
                <div className="space-y-3">
                  {form.portfolioLinks.map((link, i) => editMode ? (
                    <div key={i} className="flex items-center"><input type="url" value={link} onChange={(e) => handleArrayChange("portfolioLinks", i, null, e.target.value)} className={inputClass} /><button type="button" onClick={() => removeItem("portfolioLinks", i)} className="ml-2 text-red-500">✖</button></div>
                  ) : <a key={i} href={link} target="_blank" rel="noreferrer" className="block text-indigo-600 font-bold hover:underline truncate">{link}</a>)}
                </div>
                {editMode && <button type="button" onClick={() => addItem("portfolioLinks")} className="text-indigo-600 font-bold text-sm mt-4 hover:underline">+ Add Link</button>}
              </fieldset>
            </div>

            <div>
              <label className="block mb-2 font-bold text-slate-700">Resume URL</label>
              {editMode ? <input type="url" name="resume" value={form.resume} onChange={handleChange} className={inputClass} /> : (
                form.resume ? <a href={form.resume} target="_blank" rel="noreferrer" className="text-white bg-indigo-600 px-4 py-2 rounded font-bold hover:bg-indigo-700 inline-block shadow">Download / View PDF</a> : <span className="text-slate-500 font-bold">No resume uploaded.</span>
              )}
            </div>

            {editMode && (
              <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setEditMode(false)} className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" disabled={loading} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:-translate-y-0.5 transition transform">Save Profile</button>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;