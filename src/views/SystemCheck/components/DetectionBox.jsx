import React from "react";
import checkImg from "../../../assets/images/tick-circle.svg";
import issueImg from "../../../assets/images/danger.svg";

const DetectionBox = ({ item, isPersonShowing }) => {
  return (
    <div
      className={`detecting-box ${isPersonShowing ? "double-circle" : ""} ${
        isPersonShowing && !item.listener ? "error" : ""
      }`}
    >
      <div className="detecting-box-indicator">
        {isPersonShowing && <img src={item.img} alt={item.label} />}
      </div>
      {!isPersonShowing ? (
        <div className="detecting-box-circle">
          <img src={item.img} alt={item.label} />
        </div>
      ) : item.isBoolean && item.listener ? (
        <div className={`detecting-box-circle`}>
          <div className="detecting-box-circle-inner">
            <img src={checkImg} alt="check" width={15} />
          </div>
        </div>
      ) : (
        <div className="detecting-box-circle">
          <div className="detecting-box-circle-inner">
            <img src={issueImg} alt="Issue" />
          </div>
        </div>
      )}

      <span>{item.label}</span>
    </div>
  );
};

export default DetectionBox;
