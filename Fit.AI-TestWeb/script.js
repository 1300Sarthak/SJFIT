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
let count = 0;
let countNum = 1;
const calculate_angle = (a, b, c) => {
  // Extract points
  let aTemp = { x: a.x, y: a.y };
  let bTemp = { x: b.x, y: b.y };
  let cTemp = { x: c.x, y: c.y };

  // Calculate radians using atan2
  let radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);

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
};

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
      ? "DISABLE PREDICTIONS"
      : "ENABLE PREDICTIONS";

    if (webcamRunning) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.addEventListener("loadeddata", renderLoop);
    }
  });
}

let lastVideoTime = -1;
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
        calculate_angle(
          results.landmarks[0][11], //R- shoulder
          results.landmarks[0][13], //R - elbow
          results.landmarks[0][15] // R - wrist
        );
      } catch (TypeError) {
        console.log("Honk Honk hit the klaxon");
      }

      lastVideoTime = video.currentTime;
    }

    requestAnimationFrame(() => {
      renderLoop();
    });
  }
}

/*
async function predictWebcam() {
  if (poseLandmarker && canvasCtx && webcamRunning) {
    //const startTimeMs = performance.now();
    const videoTime = video.currentTime;

    if (videoTime !== lastVideoTime) {
      lastVideoTime = videoTime;

      const results = await poseLandmarker.detectForVideo(
        video, startTimeMs
      );
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
    }
    requestAnimationFrame(predictWebcam);
  }
}
  */
