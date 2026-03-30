import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { fetchCompanies, selectAllCompanies, updateCompany } from "../../slices/companySlice";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const CompanyProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const companies = useSelector(selectAllCompanies);
  const company = companies.find((c) => c.user === id);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!company) {
      dispatch(fetchCompanies());
    } else {
      setFormData(company);
    }
  }, [company, dispatch]);

  const handleNestedChange = (e, parentKey) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [parentKey]: { ...prev[parentKey], [name]: value } }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    dispatch(updateCompany({ id: company._id, data: formData })).unwrap()
      .then(() => {
        setEditMode(false);
        toast.success("Profile updated successfully!");
      })
      .catch((err) => toast.error("Failed to update: " + (err?.message || err)));
  };

  if (!company || !formData) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading profile...</div>;

  const inputClass = "w-full p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";
  const viewClass = "w-full p-3 bg-slate-50 rounded-lg text-slate-800 font-medium break-words";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">{editMode ? "Edit Profile" : "Company Profile"}</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Review or update your organizational details.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 border border-slate-100">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block mb-2 font-bold text-slate-700">Company Name</label>
                {editMode ? <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required /> : <div className={viewClass}>{formData.name}</div>}
              </div>
              <div>
                <label className="block mb-2 font-bold text-slate-700">Size</label>
                {editMode ? (
                  <select name="size" value={formData.size} onChange={handleChange} className={inputClass}>
                    {["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : <div className={viewClass}>{formData.size} Employees</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-bold text-slate-700">Industry</label>
                {editMode ? <input type="text" name="industry" value={formData.industry} onChange={handleChange} className={inputClass} /> : <div className={viewClass}>{formData.industry || "N/A"}</div>}
              </div>
              <div>
                <label className="block mb-2 font-bold text-slate-700">Website</label>
                {editMode ? <input type="url" name="website" value={formData.website} onChange={handleChange} className={inputClass} /> : (
                  formData.website ? <a href={formData.website} target="_blank" rel="noreferrer" className="w-full p-3 bg-indigo-50 text-indigo-600 rounded-lg font-bold block hover:underline truncate">{formData.website}</a> : <div className={viewClass}>N/A</div>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-bold text-slate-700">Description</label>
              {editMode ? <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={`${inputClass} resize-y`} /> : <div className={`${viewClass} whitespace-pre-line`}>{formData.description || "No description provided."}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <fieldset className="border border-slate-200 p-6 rounded-xl bg-slate-50/30">
                <legend className="font-bold text-lg text-slate-800 px-3">Location</legend>
                <div className="space-y-4 mt-2">
                  {["address", "city", "state", "country", "pincode"].map((field) => (
                    <div key={field}>
                      <label className="block mb-1 capitalize font-semibold text-slate-600 text-sm">{field}</label>
                      {editMode ? <input type="text" name={field} value={formData.location[field]} onChange={(e) => handleNestedChange(e, "location")} className={inputClass} /> : <div className="text-slate-800 font-medium bg-white p-2 rounded border border-slate-100">{formData.location[field] || "-"}</div>}
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset className="border border-slate-200 p-6 rounded-xl bg-slate-50/30">
                <legend className="font-bold text-lg text-slate-800 px-3">Contact Person</legend>
                <div className="space-y-4 mt-2">
                  {["name", "email", "phone"].map((field) => (
                    <div key={field}>
                      <label className="block mb-1 capitalize font-semibold text-slate-600 text-sm">{field}</label>
                      {editMode ? <input type={field === "email" ? "email" : "text"} name={field} value={formData.contactPerson[field]} onChange={(e) => handleNestedChange(e, "contactPerson")} className={inputClass} /> : <div className="text-slate-800 font-medium bg-white p-2 rounded border border-slate-100">{formData.contactPerson[field] || "-"}</div>}
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-slate-100">
              {editMode ? (
                <>
                  <button type="button" onClick={() => { setEditMode(false); setFormData(company); }} className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">Cancel</button>
                  <button type="button" onClick={handleSave} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:-translate-y-0.5 transition transform">Save Changes</button>
                </>
              ) : (
                <button type="button" onClick={() => setEditMode(true)} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:-translate-y-0.5 transition transform">Edit Profile</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;