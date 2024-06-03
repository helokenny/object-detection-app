import React, { useState } from "react";
import ObjectDetection from "./components/ObjectDetection";
import CustomModal from "./components/CustomModal";

const SystemCheck = () => {
  const [isReady, setIsReady] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const doContinue = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="page">
        <div className="header">System check</div>
        <div className="paragraph">
          We utilize your camera image to ensure fairness for all participants,
          and we also employ both your camera and microphone for a video
          questions where you will be prompted to record a response using your
          camera or webcam, so it's essential to verify that your camera and
          microphone are functioning correctly and that you have a stable
          internet connection. To do this, please position yourself in front of
          your camera, ensuring that your entire face is clearly visible on the
          screen. This includes your forehead, eyes, ears, nose, and lips. You
          can initiate a 5-second recording of yourself by clicking the button
          below.
        </div>
        <ObjectDetection setIsReady={setIsReady} />
        <button className="submit-btn" disabled={!isReady} onClick={doContinue}>
          Take picture and continue
        </button>
      </div>
      {showModal && <CustomModal setShowModal={setShowModal} />}
    </>
  );
};

export default SystemCheck;
