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
  if (video.currentTime !== lastVideoTime) {
    const results = poseLandmarker.detectForVideo(video, startTimeMs);
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.landmarks) {
      results.landmarks.forEach((landmark) => {
        const drawingUtils = new DrawingUtils(canvasCtx);
        drawingUtils.drawLandmarks(landmark);
        drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
      });
    }
    lastVideoTime = video.currentTime;
  }

  requestAnimationFrame(() => {
    renderLoop();
  });
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
