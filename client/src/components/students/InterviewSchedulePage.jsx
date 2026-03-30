import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyInterviews, selectInterviewError, selectInterviewLoading, selectInterviewsByStudent } from '../../slices/interviewSlice';

const InterviewSchedulePage = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);
    const interviews = useSelector((state) => selectInterviewsByStudent(state, userId));
    const isLoading = useSelector(selectInterviewLoading);
    const isError = useSelector(selectInterviewError);

    useEffect(() => {
        if (userId) dispatch(fetchMyInterviews());
    }, [dispatch, userId]);

    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-16">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 shadow-xl rounded-b-[3rem]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">My Interview Schedule</h1>
            <p className="text-lg md:text-xl font-medium text-indigo-100">View your upcoming and past interview details.</p>
          </div>
        </div>

        {/* Content Card */}
        <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
            {isLoading ? (
              <p className="text-center text-slate-500 font-medium py-8">Loading interviews...</p>
            ) : isError ? (
              <p className="text-center text-red-500 font-medium py-8">Error: {isError}</p>
            ) : !interviews.length ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No interviews scheduled yet.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Job / Drive</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Location / Link</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Interviewer(s)</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {interviews.map(({ _id, job, interviewDate, location, interviewers, interviewType, meetingId, status }) => (
                      <tr key={_id} className="hover:bg-indigo-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-semibold">{job?.title || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">{new Date(interviewDate).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {interviewType === 'Online' ? (
                            <a href={`https://zoom.us/j/${meetingId}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                              🔗 Zoom Link
                            </a>
                          ) : (
                            <span className="text-slate-600">📍 {location || 'N/A'}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                          {interviewers?.length ? `${interviewers.length} Assigned` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 
                            status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                            status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    )
}

export default InterviewSchedulePage;