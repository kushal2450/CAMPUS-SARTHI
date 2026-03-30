import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchUsers, selectUsers } from "../slices/authSlice";
import { fetchStudents, selectStudentError, selectStudentLoading, selectStudents } from "../slices/studentSlice";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

const StudentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector(selectUsers);
  const students = useSelector(selectStudents);
  const loading = useSelector(selectStudentLoading);
  const error = useSelector(selectStudentError);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchUsers());
  }, [dispatch]);

  const userMap = new Map(users.map((u) => [u._id, u]));

  const filteredStudents = students.filter((student) => {
    const user = userMap?.get(student.userId);
    return (user?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Student Directory</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Search and manage registered student profiles.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center mb-8">
          <FaSearch className="text-slate-400 ml-4 mr-3 text-xl" />
          <input
            type="text"
            placeholder="Search students by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 outline-none text-lg font-medium text-slate-700 bg-transparent"
          />
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
          {loading && <p className="text-center font-bold text-slate-500 py-10">Loading directory...</p>}
          {error && <p className="text-center font-bold text-red-500 py-10">Error: {error}</p>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Contact Email</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredStudents.length === 0 ? (
                    <tr><td colSpan="3" className="text-center p-8 text-slate-500 font-medium">No students match your search.</td></tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const user = userMap.get(student.userId);
                      return (
                        <tr key={student._id} className="hover:bg-indigo-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 text-xs">
                              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            {user?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">{user?.email || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => navigate(`/admin/student/profiles/${student._id}`)}
                              className="px-5 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-600 hover:text-white transition"
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      );
                    })
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

export default StudentList;