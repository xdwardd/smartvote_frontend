import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const Recognition = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Loading models...");
  const [recognized, setRecognized] = useState(new Set());
  const [isModelsReady, setIsModelsReady] = useState(false);

  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        setStatus("Models loaded ✅");
        setIsModelsReady(true);
      } catch (err) {
        setStatus("Failed to load models ❌");
        console.error(err);
      }
    };

    loadModels();
  }, []);

  // Recognition loop
  useEffect(() => {
    if (!isModelsReady) return;

    const interval = setInterval(async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video.readyState === 4 // fully loaded
      ) {
        const video = webcamRef.current.video;

        const detections = await faceapi
          .detectAllFaces(video)
          .withFaceLandmarks()
          .withFaceDescriptors();

        const dims = {
          width: video.videoWidth,
          height: video.videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, dims);

        const resized = faceapi.resizeResults(detections, dims);
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, dims.width, dims.height);

        const labeledDescriptors = await loadLabeledDescriptors();
        const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

        resized.forEach((det) => {
          const match = matcher.findBestMatch(det.descriptor);
          const { box } = det.detection;

          const drawBox = new faceapi.draw.DrawBox(box, {
            label: match.toString(),
          });
          drawBox.draw(canvasRef.current);

          if (match.label !== "unknown") {
            setRecognized((prev) => new Set(prev).add(match.label));
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isModelsReady]);

  // Load face descriptors from localStorage
  const loadLabeledDescriptors = async () => {
    const data = JSON.parse(localStorage.getItem("face-db")) || [];
    const map = new Map();

    for (const item of data) {
      const desc = new Float32Array(item.descriptor);
      if (!map.has(item.name)) map.set(item.name, []);
      map.get(item.name).push(desc);
    }

    return Array.from(map.entries()).map(([name, descriptors]) => {
      return new faceapi.LabeledFaceDescriptors(name, descriptors);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Face Recognition</h1>
      <p className="text-blue-600 mb-2">{status}</p>

      <div className="relative w-[640px] h-[480px]">
        <Webcam
          ref={webcamRef}
          audio={false}
          width={640}
          height={480}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          className="rounded"
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 z-10"
        />
      </div>

      <div className="mt-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Recognized People:</h2>
        {recognized.size === 0 ? (
          <p className="text-gray-500">No one recognized yet.</p>
        ) : (
          <ul className="list-disc list-inside text-green-700">
            {Array.from(recognized).map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Recognition;
