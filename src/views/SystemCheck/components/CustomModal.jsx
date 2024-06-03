import React from "react";

const CustomModal = ({ setShowModal }) => {
  const closeModal = (e) => {
    setShowModal(false);
  };
  const noCloseRegion = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-bg" onClick={closeModal}>
      <div className="modal-box" onClick={noCloseRegion}>
        <div className="modal-header">
          <span>Start assessment</span>
          <button className="modal-close-btn" onClick={closeModal}>
            Close
          </button>
        </div>
        <div className="modal-main">
          <span className="title">Proceed to start assessment</span>
          <span className="paragraph">
            Kindly keep to the rules of the assessment and sit up, stay in front
            of your camera/webcam and start your assessment.
          </span>
        </div>
        <div className="modal-footer">
          <button className="modal-submit-btn">Proceed</button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
