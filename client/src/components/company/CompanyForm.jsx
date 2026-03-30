import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCompany } from "../../slices/companySlice";
import { selectAuthUser } from "../../slices/authSlice";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const CompanyForm = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: authUser.name || "", industry: "", size: "1-10", description: "", logo: "", website: "",
    location: { address: "", city: "", state: "", country: "", pincode: "" },
    contactPerson: { name: "", email: "", phone: "" },
    socialLinks: { linkedin: "", twitter: "", facebook: "" },
  });

  const [errors, setErrors] = useState({});

  const isValidURL = (string) => {
    if (!string) return true;
    try { new URL(string.trim()); return true; } catch { return false; }
  };

  const isValidPhone = (phone) => {
    if (!phone) return true;
    return phone.replace(/\D/g, "").length === 10;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Company name is required.";
    if (formData.logo && !isValidURL(formData.logo)) newErrors.logo = "Valid Logo URL required.";
    if (formData.website && !isValidURL(formData.website)) newErrors.website = "Valid Website URL required.";
    Object.entries(formData.socialLinks).forEach(([key, value]) => {
      if (value && !isValidURL(value)) newErrors[`socialLinks_${key}`] = `Valid URL required for ${key}.`;
    });
    if (formData.contactPerson.phone && !isValidPhone(formData.contactPerson.phone)) {
      newErrors.contactPerson_phone = "Phone must be exactly 10 digits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNestedChange = (e, parentKey) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [parentKey]: { ...prev[parentKey], [name]: value } }));
    
    if (parentKey === "contactPerson" && name === "phone") {
      setErrors((prev) => ({ ...prev, contactPerson_phone: isValidPhone(value) ? "" : "Phone must be exactly 10 digits." }));
    }
    if (parentKey === "socialLinks" || name === "logo" || name === "website") {
      const urlValue = parentKey === "socialLinks" ? value : formData[name];
      const errorKey = parentKey === "socialLinks" ? `socialLinks_${name}` : name;
      setErrors((prev) => ({ ...prev, [errorKey]: isValidURL(urlValue) ? "" : `Valid URL required.` }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "logo" || name === "website") setErrors((prev) => ({ ...prev, [name]: isValidURL(value) ? "" : `Valid URL required.` }));
    if (name === "name") setErrors((prev) => ({ ...prev, name: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return toast.error("Please fix the errors in the form.");
    
    dispatch(createCompany({ ...formData, user: authUser._id })).unwrap()
      .then(() => {
        toast.success("Company profile created!");
        navigate("/company/dashboard");
      })
      .catch((err) => toast.error(err || "Failed to create profile."));
  };

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate("/company/dashboard")} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Create Company Profile</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Set up your organizational details to start recruiting.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block mb-2 font-bold text-slate-700">Company Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block mb-2 font-bold text-slate-700">Size</label>
                <select name="size" value={formData.size} onChange={handleChange} className={inputClass}>
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="201-500">201-500 Employees</option>
                  <option value="501-1000">501-1000 Employees</option>
                  <option value="1000+">1000+ Employees</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-bold text-slate-700">Industry</label>
              <input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g. Information Technology, Finance" className={inputClass} />
            </div>

            <div>
              <label className="block mb-2 font-bold text-slate-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Briefly describe what your company does..." className={`${inputClass} resize-y`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-bold text-slate-700">Logo URL</label>
                <input type="url" name="logo" value={formData.logo} onChange={handleChange} placeholder="https://..." className={inputClass} />
                {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
              </div>
              <div>
                <label className="block mb-2 font-bold text-slate-700">Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." className={inputClass} />
                {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
              </div>
            </div>

            <fieldset className="border border-slate-200 p-6 rounded-xl bg-slate-50/50">
              <legend className="font-bold text-lg text-slate-800 px-3">Location Details</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                {["address", "city", "state", "country", "pincode"].map((field) => (
                  <div key={field} className={field === "address" ? "md:col-span-2" : ""}>
                    <label className="block mb-2 capitalize font-bold text-slate-700">{field}</label>
                    <input type="text" name={field} value={formData.location[field]} onChange={(e) => handleNestedChange(e, "location")} className={inputClass} />
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className="border border-slate-200 p-6 rounded-xl bg-slate-50/50">
              <legend className="font-bold text-lg text-slate-800 px-3">Contact Person</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                {["name", "email", "phone"].map((field) => (
                  <div key={field}>
                    <label className="block mb-2 capitalize font-bold text-slate-700">{field}</label>
                    <input type={field === "email" ? "email" : "text"} name={field} value={formData.contactPerson[field]} onChange={(e) => handleNestedChange(e, "contactPerson")} className={inputClass} />
                    {field === "phone" && errors.contactPerson_phone && <p className="text-red-500 text-sm mt-1">{errors.contactPerson_phone}</p>}
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className="border border-slate-200 p-6 rounded-xl bg-slate-50/50">
              <legend className="font-bold text-lg text-slate-800 px-3">Social Links</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                {["linkedin", "twitter", "facebook"].map((field) => (
                  <div key={field}>
                    <label className="block mb-2 capitalize font-bold text-slate-700">{field}</label>
                    <input type="url" name={field} value={formData.socialLinks[field]} onChange={(e) => handleNestedChange(e, "socialLinks")} placeholder={`https://${field}.com/...`} className={inputClass} />
                    {errors[`socialLinks_${field}`] && <p className="text-red-500 text-sm mt-1">{errors[`socialLinks_${field}`]}</p>}
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="pt-6">
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
                Create Company Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;