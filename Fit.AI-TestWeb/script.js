"use strict";

import {
  FilesetResolver,
  PoseLandmarker,
  DrawingUtils,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js";

let poseLandmarker;
let runningMode = "VIDEO";
let webcamRunning = false;

const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement ? canvasElement.getContext("2d") : null;
const enableWebcamButton = document.getElementById("webcamButton");
const video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");

const curlCounter = document.createElement("div");

console.log(video.innerHTML + "working?");

(async function createPoseLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
      delegate: "CPU",
    },
    runningMode: runningMode,
    numPoses: 1,
    minPoseDetectionConfidence: 0.7,
    minPosePresenceConfidence: 0.7,
    minTrackingConfidence: 0.7,
    outputSegmentationMasks: true,
  });
  console.log("PoseLandmarker initialized");
})();

// Enable Webcam
if (navigator.mediaDevices?.getUserMedia) {
  enableWebcamButton.addEventListener("click", async () => {
    if (!poseLandmarker) {
      console.log("Wait! poseLandmaker not loaded yet.");
      return;
    } else {
      console.log("Webcam loaded!");
      console.log(poseLandmarker);
    }
    webcamRunning = !webcamRunning;
    enableWebcamButton.textContent = webcamRunning
      ? "DISABLE TRACKER"
      : "ENABLE TRACKER";

    if (webcamRunning) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.addEventListener("loadeddata", renderLoop);
      updateCurlCounter("begin", 0);
    }
  });
}

let lastVideoTime = -1;
let Langle = 0;
let Lcounter = 0;
let Lstage = "up";
function renderLoop() {
  let startTimeMs = performance.now(); //performance in milliseconds
  if (webcamRunning) {
    if (video.currentTime !== lastVideoTime) {
      const results = poseLandmarker.detectForVideo(video, startTimeMs);
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      if (results.landmarks) {
        results.landmarks.forEach((landmark) => {
          const drawingUtils = new DrawingUtils(canvasCtx);
          drawingUtils.drawLandmarks(landmark);
          drawingUtils.drawConnectors(
            landmark,
            PoseLandmarker.POSE_CONNECTIONS
          );
        });
      }

      try {
        let Lshoulder = results.landmarks[0][11];
        let Lelbow = results.landmarks[0][13];
        let Lwrist = results.landmarks[0][15];
        Langle = calculate_angle(Lshoulder, Lelbow, Lwrist);
        if (Langle > 140) {
          Lstage = "down";
          console.log("down ");
          updateCurlCounter("down", Lcounter);
        } else if (Langle < 50 && Lstage == "down") {
          Lcounter++;
          Lstage = "up";
          updateCurlCounter("up", Lcounter);
          console.log("up +1");
        }
      } catch (TypeError) {
        //if not detected, implement it so that it will stop the counter or print an alert or something
        console.log("Honk Honk hit the klaxon");
      }

      lastVideoTime = video.currentTime;
    }

    requestAnimationFrame(() => {
      renderLoop();
    });
  }
}
let count = 0;
let countNum = 1;
const calculate_angle = (a, b, c) => {
  let aTemp = { x: a.x, y: a.y };
  let bTemp = { x: b.x, y: b.y };
  let cTemp = { x: c.x, y: c.y };
  // Calculate radians using atan2
  let radians =
    Math.atan2(cTemp.y - bTemp.y, cTemp.x - bTemp.x) -
    Math.atan2(aTemp.y - bTemp.y, aTemp.x - bTemp.x);
  // Convert radians to degrees
  let angle = Math.abs((radians * 180.0) / Math.PI);
  // Normalize angle to [0, 180]
  if (angle > 180) {
    angle = 360 - angle;
  }
  if (count === 50) {
    console.log(angle);
    count = 0;
  }
  count++;
  return angle;
};

const updateCurlCounter = (Lstage, Lcounter) => {
  curlCounter.innerHTML = Lstage + "! Reps: " + Lcounter;
  liveView.appendChild(curlCounter);
};
