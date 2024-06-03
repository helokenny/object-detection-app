import React, { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import img1 from "../../../assets/images/img1.svg";
import img2 from "../../../assets/images/img2.svg";
import img3 from "../../../assets/images/img3.svg";
import img4 from "../../../assets/images/img4.svg";
import DetectionBox from "./DetectionBox";

const BRIGHTNESS_THRESHOLD = 80;

const ObjectDetection = ({ setIsReady }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const personRef = useRef();

  const [isPersonShowing, setIsPersonShowing] = useState(personRef?.current);

  const [isProperlyLit, setIsProperlyLit] = useState(true);
  const [isNetworkFast, setIsNetworkFast] = useState(false);

  const [isMicActive, setIsMicActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    checkMediaDevices();
    runObjectDetection();
    checkNetworkSpeed();
  }, []);

  useEffect(() => {
    // setIsReady(isProperlyLit && isNetworkFast && isMicActive && isCameraActive);
    setIsReady(isPersonShowing);
  }, [isPersonShowing]);

  const checkMediaDevices = async () => {
    try {
      const streamAudio = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (streamAudio) {
        setIsMicActive(true);
        streamAudio.getTracks().forEach((track) => track.stop());
      }
    } catch (error) {
      setIsMicActive(false);
    }
    try {
      const streamVideo = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (streamVideo) {
        setIsCameraActive(true);
        streamVideo.getTracks().forEach((track) => track.stop());
      }
    } catch (error) {
      setIsCameraActive(false);
    }
  };

  const detectionItems = [
    {
      label: "Webcam",
      img: img1,
      listener: isCameraActive,
      isBoolean: true,
    },
    {
      label: "Internet Speed",
      img: img2,
      listener: isNetworkFast,
      isBoolean: true,
    },
    {
      label: "Gadget mic",
      img: img3,
      listener: isMicActive,
      isBoolean: true,
    },
    {
      label: "Lighting",
      img: img4,
      listener: isProperlyLit,
      isBoolean: true,
    },
  ];

  const runObjectDetection = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    const model = await cocoSsd.load();
    setInterval(async () => {
      const predictions = await model.detect(video);
      drawPredictions(predictions, canvas);
      checkLighting(video);
    }, 1000); // Object detection every 1 second
  };

  const drawPredictions = (predictions, canvas) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (!predictions.length) {
      personRef.current = "no-person";
      setIsPersonShowing(false);
    }

    predictions.forEach((prediction) => {
      personRef.current = prediction.class;
      setIsPersonShowing(personRef.current == "person");
      const [x, y, width, height] = prediction.bbox;
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      ctx.stroke();
      ctx.font = "18px Arial";
      ctx.fillText(prediction.class, x, y - 5);
    });
  };

  const checkLighting = (video) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let brightnessSum = 0;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const brightness =
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      brightnessSum += brightness;
    }

    const averageBrightness = brightnessSum / (canvas.width * canvas.height);
    setIsProperlyLit(averageBrightness > BRIGHTNESS_THRESHOLD);
  };

  const checkNetworkSpeed = () => {
    if (navigator.connection) {
      const connection = navigator.connection;
      setIsNetworkFast(
        connection.effectiveType !== "slow-2g" &&
          connection.effectiveType !== "2g"
      );
    }
  };

  return (
    <div className="detection-area">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        height={168}
        style={{
          borderRadius: 10,
          ...(isPersonShowing
            ? { border: "solid 1px transparent" }
            : { border: "solid 1px red" }),
        }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="detecting-boxes">
        {detectionItems.map((item, index) => (
          <DetectionBox item={item} isPersonShowing={isPersonShowing} />
        ))}
      </div>
    </div>
  );
};

export default ObjectDetection;
