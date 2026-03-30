import { JitsiMeeting } from "@jitsi/react-sdk";
import { useNavigate, useParams } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

const JitsiMeetComponent = () => {
  const { meetingId, user } = useParams();
  const navigate = useNavigate();

  if (!meetingId) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
          <span className="text-5xl block mb-4">⚠️</span>
          <p className="text-xl text-slate-800 font-bold mb-4">Meeting Not Found</p>
          <p className="text-slate-500 mb-6">No valid meeting ID was provided in the URL.</p>
          <button onClick={() => navigate(`/${user}/dashboard`)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col">
      {/* Sleek Dark Navbar */}
      <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 shadow-md">
        <button
          onClick={() => navigate(`/${user}/dashboard`)}
          className="flex items-center text-slate-300 hover:text-white font-semibold transition"
        >
          <FaArrowLeft className="mr-2" /> Exit Room
        </button>
        <div className="flex items-center space-x-3 text-white font-bold text-lg">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          <span>Live Interview Session</span>
        </div>
        <div className="text-slate-400 font-mono text-sm bg-slate-800 px-3 py-1 rounded">
          ID: {meetingId}
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-grow p-4 md:p-8 flex justify-center items-center">
        <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-700">
          <JitsiMeeting
            roomName={meetingId}
            getIFrameRef={node => {
              node.style.height = "75vh";
              node.style.width = "100%";
              node.style.border = "none";
            }}
            configOverwrite={{
              startWithAudioMuted: true,
              startWithVideoMuted: false,
            }}
            interfaceConfigOverwrite={{
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'desktop', 'fullscreen',
                'hangup', 'chat', 'settings', 'raisehand', 'videoquality',
              ],
            }}
            userInfo={{
              displayName: "Interviewer", // Or dynamically set based on user role
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default JitsiMeetComponent;