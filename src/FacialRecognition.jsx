// FacialRecognition.js
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const FacialRecognition = () => {
  const webcamRef = useRef(null);
  const [idImage, setIdImage] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load face-api models on component mount
  useEffect(() => {
    const loadModels = async () => {
    //   const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };
    loadModels();
  }, []);

  // Handle ID image upload
  const handleIdImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdImage(URL.createObjectURL(file));
      setMatchResult(null);
    }
  };

  const captureAndCompare = async () => {
    if (!webcamRef.current || !idImage) return;
    setLoading(true);

    // Get webcam image
    const webcamScreenshot = webcamRef.current.getScreenshot();

    const [idImg, webcamImg] = await Promise.all([
      faceapi.fetchImage(idImage),
      faceapi.fetchImage(webcamScreenshot),
    ]);

    const options = new faceapi.TinyFaceDetectorOptions();

    const [idResult, webcamResult] = await Promise.all([
      faceapi
        .detectSingleFace(idImg, options)
        .withFaceLandmarks()
        .withFaceDescriptor(),
      faceapi
        .detectSingleFace(webcamImg, options)
        .withFaceLandmarks()
        .withFaceDescriptor(),
    ]);

    if (!idResult || !webcamResult) {
      setMatchResult("Face not detected in one or both images.");
      setLoading(false);
      return;
    }

    const distance = faceapi.euclideanDistance(
      idResult.descriptor,
      webcamResult.descriptor
    );
    const isMatch = distance < 0.6;
    setMatchResult(
      isMatch
        ? `✅ Faces Match (Distance: ${distance.toFixed(4)})`
        : `❌ Faces Do Not Match (Distance: ${distance.toFixed(4)})`
    );
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Face Match with ID</h2>

      <input type="file" accept="image/*" onChange={handleIdImageChange} />
      {idImage && (
        <img
          src={idImage}
          alt="ID"
          style={{ maxWidth: "100%", marginTop: "1rem" }}
        />
      )}

      <div style={{ marginTop: "1rem" }}>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
          videoConstraints={{ facingMode: "user" }}
        />
      </div>

      <button
        onClick={captureAndCompare}
        disabled={!idImage || loading}
        style={{ marginTop: "1rem" }}
      >
        {loading ? "Comparing..." : "Compare Faces"}
      </button>

      {matchResult && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{matchResult}</p>
      )}
    </div>
  );
};

export default FacialRecognition;
