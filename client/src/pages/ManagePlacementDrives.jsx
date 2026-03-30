import { useDispatch, useSelector } from "react-redux";
import {
  clearPlacementDrive, clearPlacementDriveError, createPlacementDrive, deletePlacementDrive,
  fetchPlacementDrives, selectPlacementDrives, selectPlacementDrivesError, selectPlacementDrivesLoading, updatePlacementDrive
} from "../slices/placementDriveSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const emptyDrive = {
  title: '', companyName: '', location: '', startDate: '', endDate: '', eligibilityCriteria: '',
  jobDescription: '', packageOffered: '', contactPerson: { name: '', email: '', phone: '' },
};

const ManagePlacementDrives = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const placementDrives = useSelector(selectPlacementDrives);
  const loading = useSelector(selectPlacementDrivesLoading);
  const error = useSelector(selectPlacementDrivesError);

  const [formData, setFormData] = useState(emptyDrive);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchPlacementDrives());
    dispatch(clearPlacementDrive());
    dispatch(clearPlacementDriveError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contactPerson.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({ ...prev, contactPerson: { ...prev.contactPerson, [key]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (drive) => {
    setFormData({
      ...drive,
      startDate: drive.startDate ? new Date(drive.startDate).toISOString().slice(0, 10) : '',
      endDate: drive.endDate ? new Date(drive.endDate).toISOString().slice(0, 10) : '',
    });
    setEditingId(drive._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Permanently delete this placement drive?')) {
      dispatch(deletePlacementDrive(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updatePlacementDrive({ id: editingId, data: formData }));
      toast.success("Placement Drive updated successfully!");
    } else {
      dispatch(createPlacementDrive(formData));
      toast.success("Placement Drive created successfully!");
    }
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyDrive);
  };

  const handleCancel = () => { setShowForm(false); setEditingId(null); setFormData(emptyDrive); };

  const inputClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate(`/admin/dashboard`)} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Admin Hub
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Manage Placement Drives</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Create and oversee recruitment events for the university.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        
        {!showForm && (
          <div className="flex justify-end mb-6">
            <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:-translate-y-0.5 transition transform">
              + Create New Drive
            </button>
          </div>
        )}

        {showForm && (
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
              {editingId ? "Edit Placement Drive" : "Create Placement Drive"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block mb-2 font-bold text-slate-700">Drive Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputClass} /></div>
                <div><label className="block mb-2 font-bold text-slate-700">Company Name</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className={inputClass} /></div>
                <div><label className="block mb-2 font-bold text-slate-700">Location</label><input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClass} /></div>
                <div><label className="block mb-2 font-bold text-slate-700">Package Offered</label><input type="text" name="packageOffered" value={formData.packageOffered} onChange={handleChange} className={inputClass} /></div>
                <div><label className="block mb-2 font-bold text-slate-700">Start Date</label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className={inputClass} /></div>
                <div><label className="block mb-2 font-bold text-slate-700">End Date</label><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className={inputClass} /></div>
              </div>

              <div><label className="block mb-2 font-bold text-slate-700">Eligibility Criteria</label><input type="text" name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleChange} className={inputClass} /></div>
              <div><label className="block mb-2 font-bold text-slate-700">Job Description</label><textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange} rows={3} className={`${inputClass} resize-y`} /></div>

              <fieldset className="border border-slate-200 p-6 rounded-xl bg-slate-50">
                <legend className="font-bold text-slate-700 px-2">Contact Person</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input type="text" name="contactPerson.name" value={formData.contactPerson.name} onChange={handleChange} placeholder="Name" className={inputClass} />
                  <input type="email" name="contactPerson.email" value={formData.contactPerson.email} onChange={handleChange} placeholder="Email" className={inputClass} />
                  <input type="text" name="contactPerson.phone" value={formData.contactPerson.phone} onChange={handleChange} placeholder="Phone" className={inputClass} />
                </div>
              </fieldset>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={handleCancel} className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow hover:bg-indigo-700 transition">{editingId ? 'Update Drive' : 'Launch Drive'}</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
          {loading ? ( <p className="text-center text-slate-500 font-bold p-8">Loading placement drives...</p> ) : 
           error ? ( <p className="text-center text-red-500 font-bold p-8">Error: {error}</p> ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Drive Details</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Timeline</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {placementDrives.length === 0 ? (
                    <tr><td colSpan="4" className="text-center p-8 text-slate-500 font-medium">No Placement Drives configured.</td></tr>
                  ) : (
                    placementDrives.map((drive) => (
                      <tr key={drive._id} className="hover:bg-indigo-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-slate-800">{drive.title}</div>
                          <div className="text-sm font-medium text-indigo-600">{drive.companyName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">{drive.location || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-sm font-medium">
                          {new Date(drive.startDate).toLocaleDateString()} <br/>to<br/> {new Date(drive.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          <button onClick={() => handleEdit(drive)} className="text-indigo-600 hover:text-indigo-800 hover:underline mr-4">Edit</button>
                          <button onClick={() => handleDelete(drive._id)} className="text-red-500 hover:text-red-700 hover:underline">Delete</button>
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
    </div>
  );
};

export default ManagePlacementDrives;