import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchPlacementDrives, selectPlacementDrives } from "../../slices/placementDriveSlice";
import { useEffect } from "react";
import PostJob from "./PostJob"; // Assuming PostJob is in the same directory
import { FaArrowLeft } from "react-icons/fa";

const PlacementDriveJobPostWrapper = () => {
  const { placementDriveId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const drives = useSelector(selectPlacementDrives);

  useEffect(() => {
    if (!drives.length) {
      dispatch(fetchPlacementDrives());
    }
  }, [dispatch, drives.length]);

  if (placementDriveId) {
    return <PostJob placementDriveId={placementDriveId} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem] relative">
        <button onClick={() => navigate('/company/dashboard')} className="absolute top-6 left-6 md:left-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center transition font-semibold shadow-sm">
          <FaArrowLeft className="mr-2" /> Dashboard
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Select a Placement Drive</h1>
          <p className="text-lg md:text-xl font-medium text-indigo-100">Choose an active campus drive to associate with your new job posting.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drives.map((drive) => (
            <button
              key={drive._id}
              onClick={() => navigate(`/company/postJob/${drive._id}`)}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 transition duration-300 text-left group flex flex-col outline-none"
            >
              <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                🎓
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition">{drive.title}</h3>
              <p className="text-slate-500 font-medium mb-4">
                Starts: <span className="text-slate-700 font-bold">{new Date(drive.startDate).toLocaleDateString()}</span>
              </p>
              <div className="mt-auto pt-4 border-t border-slate-100 text-indigo-600 font-bold text-sm flex items-center group-hover:text-indigo-800">
                Post Job Here <span className="ml-2">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacementDriveJobPostWrapper;