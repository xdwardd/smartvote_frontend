import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import testStudentdata from '../testdata.js';



const Login = ({ setActivePage, setName }) => {
  const [data, setData] = useState({ student_id: "", password: "" });
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Loading models...");
  const [isModelsReady, setIsModelsReady] = useState(false);
  const [openCam, setOpenCam] = useState(false);
  const [error, setError] = useState("");
  const [loadingRedirect, setLoadingRedirect] = useState(false);
  const [loginUser, setLoginUser] = useState(null); // <- holds the user after credentials match
  const [isFaceMatched, setIsFaceMatched] = useState(false);

  const facedb = JSON.parse(localStorage.getItem("face-db")) || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = (event) => {
    event.preventDefault();

    // admin credentials
    const admin = testStudentdata.getAdmin();
    const isAdmin = admin.some(
      (a) => a.admin_id === data.student_id && a.password === data.password)

    if(isAdmin){
      setActivePage("admin_dashboard");
    
    }
      

    if (facedb.length === 0) {
      setError("Please register your face first.");
      return;
    }
    if (!data.student_id || !data.password) {
      setError("Please fill all fields.");
      return;
    }

    const user = facedb.find(
      (user) =>
        user.student_id === data.student_id && user.password === data.password
    );

    if (user) {
      setError("");
      setLoginUser(user); // Save login user
      setOpenCam(true);
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

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

  // Run face verification only for the logged-in user's descriptor
  useEffect(() => {
    if (!isModelsReady || !loginUser || !loginUser.descriptor) return;

    const targetDescriptor = new Float32Array(loginUser.descriptor);
    const labeledDescriptor = new faceapi.LabeledFaceDescriptors(
      loginUser.student_id,
      [targetDescriptor]
    );

    const matcher = new faceapi.FaceMatcher([labeledDescriptor], 0.6);

    const interval = setInterval(async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video.readyState === 4
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

        resized.forEach((det) => {
          const match = matcher.findBestMatch(det.descriptor);
          const { box } = det.detection;

          const drawBox = new faceapi.draw.DrawBox(box, {
            label: match.toString(),
          });
          drawBox.draw(canvasRef.current);

          if (match.label === loginUser.student_id) {
            setIsFaceMatched(true);
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isModelsReady, loginUser]);

  // Handle successful face match
  useEffect(() => {
    if (isFaceMatched && loginUser) {
      setLoadingRedirect(true);
      setTimeout(() => {
        setOpenCam(false);
        setName(loginUser.firstname + " " + loginUser.lastname);
        setActivePage("dashboard");
      }, 5000);
    }
  }, [isFaceMatched]);

  // === RENDER ===

  if (openCam) {
    return (
      <>
        {loadingRedirect && (
          <div className="flex flex-col items-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="mt-2 text-blue-600 font-medium">Redirecting to dashboard...</p>
          </div>
        )}

        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
          <h1 className="text-2xl font-bold mb-4">Face Recognition</h1>
          <p className="text-blue-600 mb-2">{status}</p>
          <div className="relative w-[640px] h-[480px]">
            {isModelsReady ? (
              <>
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
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                <span className="text-gray-500">Loading webcam...</span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="student_id" className="block text-gray-700 mb-2">
              Student ID
            </label>
            <input
              type="text"
              id="student_id"
              name="student_id"
              value={data.student_id}
              required
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              required
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-red-500 text-center mb-4">{error}</div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="text-sm text-center mt-4">
          Don't have an Account?{" "}
          <span
            className="text-blue-400 hover:text-blue-700 cursor-pointer"
            onClick={() => setActivePage("register")}
          >
            Create Account
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
