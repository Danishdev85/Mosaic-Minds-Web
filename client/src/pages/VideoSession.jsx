import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { FaLeaf, FaExclamationTriangle } from "react-icons/fa";

export default function VideoSession() {
  const location = useLocation();

  const appointment = location.state?.appointment;

  const [loading, setLoading] = useState(true);
  const [meetingError, setMeetingError] = useState(false);
  const [leftMeeting, setLeftMeeting] = useState(false);

  if (!appointment) {
    return (
      <div className="min-h-screen bg-umber flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <FaExclamationTriangle className="text-4xl text-amber mx-auto mb-5" />

          <h2 className="font-display text-2xl text-white mb-3">
            Session Not Found
          </h2>

          <p className="text-white/65 mb-8">
            We couldn't find the information required to join this therapy
            session.
          </p>

          <Link
            to="/lookup"
            className="bg-rust text-white px-6 py-3 rounded-full font-medium inline-block"
          >
            Back to My Session
          </Link>
        </div>
      </div>
    );
  }

  if (meetingError) {
    return (
      <div className="min-h-screen bg-umber flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <FaExclamationTriangle className="text-4xl text-amber mx-auto mb-5" />

          <h2 className="font-display text-2xl text-white mb-3">
            Unable to Join Session
          </h2>

          <p className="text-white/65 mb-8">
            Something went wrong while connecting to your therapy session.
            Please try again in a moment.
          </p>

          <Link
            to="/lookup"
            className="bg-rust text-white px-6 py-3 rounded-full font-medium inline-block"
          >
            Back to My Session
          </Link>
        </motion.div>
      </div>
    );
  }

  if (leftMeeting) {
    return (
      <div className="min-h-screen bg-umber flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <span className="inline-flex w-16 h-16 rounded-full bg-amber/15 text-amber items-center justify-center text-2xl mb-5">
            <FaLeaf />
          </span>

          <h2 className="font-display text-2xl text-white mb-3">
            Session Ended
          </h2>

          <p className="text-white/60 mb-8">
            Thank you for taking time for yourself today. We hope your session
            was helpful.
          </p>

          <Link
            to="/"
            className="bg-rust text-white px-6 py-3 rounded-full font-medium inline-block"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
          <div className="min-h-screen bg-umber flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 lg:px-10 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-full bg-amber/15 flex items-center justify-center text-amber">
              <FaLeaf />
            </span>

            <div>
              <h1 className="font-display text-xl text-white font-semibold">
                Mosaic Minds Therapy Session
              </h1>

              <p className="text-sm text-white/50">
                Secure & Private Video Consultation
              </p>
            </div>
          </div>

          <div className="hidden lg:block text-right">
            <p className="text-white font-medium">
              {appointment.client_name}
            </p>

            <p className="text-xs text-white/45">
              {appointment.appointment_date} • {appointment.time_slot?.slice(0,5)}
            </p>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 p-6 lg:p-8">

          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5 }}
            className="overflow-hidden rounded-3xl shadow-2xl border border-white/10 bg-black"
          >

            {loading && (
              <div className="h-[75vh] flex items-center justify-center bg-umber">
                <motion.div
                  animate={{ opacity:[0.4,1,0.4] }}
                  transition={{ duration:1.5, repeat:Infinity }}
                  className="text-white/60 text-sm"
                >
                  Connecting to your therapy session...
                </motion.div>
              </div>
            )}

            <JitsiMeeting
              roomName={appointment.video_room_name}
              getIFrameRef={(iframe) => {
                iframe.style.width = "100%";
                iframe.style.height = "75vh";
                iframe.style.border = "0";
              }}

              spinner={() => null}

              onApiReady={(externalApi) => {

                setLoading(false);

                externalApi.addListener(
                  "videoConferenceLeft",
                  () => {
                    setLeftMeeting(true);
                  }
                );

                externalApi.addListener(
                  "readyToClose",
                  () => {
                    setLeftMeeting(true);
                  }
                );

              }}

              onReadyToClose={() => {
                setLeftMeeting(true);
              }}

              interfaceConfigOverwrite={{
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                MOBILE_APP_PROMO: false,
                DEFAULT_BACKGROUND: "#2D241F",
              }}
            />

          </motion.div>

        </div>

      </div>
  );
}