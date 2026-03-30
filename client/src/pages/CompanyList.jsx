import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCompanies, selectAllCompanies, selectCompanyLoading, selectCompanyError, deleteCompany, resetCompanyState, updateCompany,
} from '../slices/companySlice';

const CompanyList = () => {
  const dispatch = useDispatch();
  const companies = useSelector(selectAllCompanies);
  const loading = useSelector(selectCompanyLoading);
  const error = useSelector(selectCompanyError);

  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({ name: '', industry: '', contactPerson: { name: '', email: '', phone: '' } });

  useEffect(() => {
    dispatch(fetchCompanies());
    return () => dispatch(resetCompanyState());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this company profile?')) {
      dispatch(deleteCompany(id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contactPerson.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({ ...prev, contactPerson: { ...prev.contactPerson, [key]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCompany({ id: editingCompany._id, data: formData }));
    setEditingCompany(null);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || '', industry: company.industry || '',
      contactPerson: { name: company.contactPerson?.name || '', email: company.contactPerson?.email || '', phone: company.contactPerson?.phone || '' },
    });
  };

  const inputClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Company Registry</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Review and manage corporate partners registered in the system.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
          
          {loading && <p className="text-center font-bold text-slate-500 py-10">Loading companies...</p>}
          {error && <p className="text-center font-bold text-red-500 py-10">Error : {error}</p>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Industry</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Contact Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {companies.length === 0 ? (
                    <tr><td colSpan="5" className="text-center p-8 text-slate-500 font-medium">No companies registered.</td></tr>
                  ) : (
                    companies.map((company) => (
                      <tr key={company._id} className="hover:bg-indigo-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">{company.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                          <span className="bg-slate-100 px-3 py-1 rounded-full text-xs">{company.industry || "N/A"}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-700">{company.contactPerson?.name || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">{company.contactPerson?.email || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          <button onClick={() => handleEdit(company)} className="text-indigo-600 hover:text-indigo-800 hover:underline mr-4">Edit</button>
                          <button onClick={() => handleDelete(company._id)} className="text-red-500 hover:text-red-700 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Editing */}
        {editingCompany && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <form className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100" onSubmit={handleUpdateSubmit}>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Edit Company</h2>
              
              <div className="space-y-4">
                <div><label className="block mb-1 text-sm font-bold text-slate-600">Company Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} /></div>
                <div><label className="block mb-1 text-sm font-bold text-slate-600">Industry</label><input type="text" name="industry" value={formData.industry} onChange={handleChange} className={inputClass} /></div>
                <div><label className="block mb-1 text-sm font-bold text-slate-600">Contact Name</label><input type="text" name="contactPerson.name" value={formData.contactPerson.name} onChange={handleChange} className={inputClass} /></div>
                <div><label className="block mb-1 text-sm font-bold text-slate-600">Contact Email</label><input type="email" name="contactPerson.email" value={formData.contactPerson.email} onChange={handleChange} className={inputClass} /></div>
                <div><label className="block mb-1 text-sm font-bold text-slate-600">Contact Phone</label><input type="text" name="contactPerson.phone" value={formData.contactPerson.phone} onChange={handleChange} className={inputClass} /></div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditingCompany(null)} className="px-5 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 transition">Save Changes</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;