import React, {useState, useEffect, useRef} from 'react'
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
const Registration = ({setActivePage}) => {

    const webcamRef = useRef(null);
      const canvasRef = useRef(null);
      const [status, setStatus] = useState("Loading models...");
      const [modelsLoaded, setModelsLoaded] = useState(false);
      const [loginData, setLoginData] = useState({
        student_id: "",
        firstname: "",
        lastname:"",
        email: "",
        password: ""
    })

    const [error, setError] = useState("");
        const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const registerface = () => {
        if(!loginData.student_id || !loginData.firstname || !loginData.lastname || !loginData.email || !loginData.password) {
            setError("Please fill all fields.");
            return;
        } else {
            setOpen(true)
        }
    }

    const [open, setOpen] = useState(false);

      // Load models on mount
      useEffect(() => {
        const loadModels = async () => {
          await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
            faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
            faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          ]);
           setStatus("Models loaded ✅");
          setModelsLoaded(true);
        };
        loadModels();
      }, [open]);
    
      // Draw face detections continuously on canvas
      useEffect(() => {
        let intervalId;
    
        if (modelsLoaded) {
          intervalId = setInterval(async () => {
            if (
              webcamRef.current &&
              webcamRef.current.video.readyState === 4 // video is ready
            ) {
              const video = webcamRef.current.video;
              const canvas = canvasRef.current;
    
              // Detect faces with landmarks
              const detections = await faceapi
                .detectAllFaces(video)
                .withFaceLandmarks();
    
              // Resize canvas to video dimensions
              const dims = {
                width: video.videoWidth,
                height: video.videoHeight,
              };
              faceapi.matchDimensions(canvas, dims);
    
              const resizedDetections = faceapi.resizeResults(detections, dims);
    
              // Clear canvas before drawing
              const ctx = canvas.getContext("2d");
              ctx.clearRect(0, 0, canvas.width, canvas.height);
    
              // Draw detections & landmarks
              faceapi.draw.drawDetections(canvas, resizedDetections);
              faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            }
          }, 100); // update every 100ms
        }
    
        return () => clearInterval(intervalId);
      }, [modelsLoaded]);
    
      // Capture face descriptor and save with name
      const captureAndRegister = async () => {
        // if (!) {
        //   setStatus("Please enter a name.");
        //   return;
        // }
    
        if (!webcamRef.current || webcamRef.current.video.readyState !== 4) {
          setStatus("Camera not ready.");
          return;
        }
    
        const video = webcamRef.current.video;
    
        const detection = await faceapi
          .detectSingleFace(video)
          .withFaceLandmarks()
          .withFaceDescriptor();
    
        if (!detection) {
          setStatus("No face detected. Please try again.");
          return;
        }
    
        // Convert descriptor to array for storage
        const descriptor = Array.from(detection.descriptor);
    
        // Load existing DB or create new
        const db = JSON.parse(localStorage.getItem("face-db")) || [];
        // db.push({ l, descriptor });
        db.push({...loginData, descriptor})
        localStorage.setItem("face-db", JSON.stringify(db));

        setTimeout(() => {
            setOpen(false)
        }, 2000);
    
        setStatus(`✅ Face registered for "${loginData.firstname} ${loginData.lastname}"`);
    
     
    };


  if(open){
  return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 space-y-4">
            <h1 className="text-2xl font-bold">Register Face</h1>
            <div className="relative w-[640px] h-[480px]">
                <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                height={480}
                videoConstraints={{ facingMode: "user" }}
                className="rounded shadow"
                />
                <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute top-0 left-0 z-10"
                />
            </div>
        
            <button
                onClick={captureAndRegister}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                disabled={!modelsLoaded}
            >
                {modelsLoaded ? "Register Face" : "Loading..."}
            </button>
        
            <p className="text-green-600">{status}</p>
         </div>
      )
  }

  const facedb = JSON.parse(localStorage.getItem("face-db")) || [];
 const handleRegister = () => {
    if(facedb.length === 0) {
        setError("Please register your face first.");
        return;
    }
    if(!loginData.student_id || !loginData.firstname || !loginData.lastname || !loginData.email || !loginData.password) {
        setError("Please fill all fields.");
        return;
    }
    setActivePage("login");
    
 }

  return (
   <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Resgister
        </h2>
        <form action="#" method="POST">
          <div className="mb-4">
            <label htmlFor="student_id" className="block text-gray-700 mb-2">
              Student Id
            </label>
            <input
              type="text"
              id="student_id"
              name="student_id"
              value={loginData.student_id}
              required
             onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-gray-700 mb-2">
              Firstname
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={loginData.firstname}
              required
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastname" className="block text-gray-700 mb-2">
              Lastname
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={loginData.lastname}
              required
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
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
              value={loginData.password}
              required
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className='mb-4 text-red-500'> 
            <p>{error}</p>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-500 mb-20 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={registerface}
          >
            Register Face
          </button>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={handleRegister}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Registration