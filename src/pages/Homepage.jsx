import axios from "axios";
import React from "react";

import { useState } from "react";
import { toast } from "react-toastify";
import { Loaders } from "../utils/Loaders";
import { useNavigate } from "react-router-dom";

const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const courses = ["BSIT", "BSCS", "BSBA", "BSED", "BEED"];

export default function Homepage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    id_number: "",
    password: "",
  });
  const [votersData, setVotersData] = useState({
    id_number: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    gender: "",
    course: "",
    year_level: "",
  });

  //register voters
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVotersData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      votersData.id_number == "" ||
      votersData.firstname == "" ||
      votersData.lastname == "" ||
      votersData.email == "" ||
      votersData.password == "" ||
      votersData.course == "" ||
      votersData.year_level == ""
    ) {
      toast.error("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/voters/register",
        votersData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.retVal == 1) {
        toast.success(response.data.resmsg);

        setTimeout(() => {
          setLoading(false);
          setIsLogin(true);
          setVotersData({
            id_number: "",
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            course: "",
            year_level: "",
          });
        }, 3000);
      } else {
        toast.error(response.data.resmsg);
      }
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    }
  };

  //Login Voter

  //register voters
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loginData.id_number == "" || loginData.password == "") {
      toast.error("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/voters/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const navigateRoute =
        response.data[0].firstname == "Admin"
          ? "/admin-dashoard"
          : "/user-dashboard";

      if (response.data?.retVal === 0) {
        toast.error(response.data?.resmsg);
        setLoading(false);
      } else {
        setTimeout(() => {
          setLoading(false);
          localStorage.setItem("userData", JSON.stringify(response.data[0]));

          navigate(navigateRoute);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 relative">
      {loading && (
        <div className="absolute inset-0 z-30  bg-transparent  flex items-center justify-center">
          <Loaders />
        </div>
      )}
      <div
        className={`bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transition duration-10 ${
          loading ? "pointer-events-none opacity-40" : "opacity-100"
        }`}
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Smart Vote
        </h1>

        {isLogin ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="id_number"
                placeholder="ID Number"
                className="input input-bordered w-full"
                value={loginData.id_number || ""}
                onChange={handleLoginChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={loginData.password || ""}
                onChange={handleLoginChange}
              />
              <button className="btn btn-primary w-full" onClick={handleLogin}>
                Login
              </button>
            </form>
            <p className="text-sm text-center mt-4">
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-500 underline"
              >
                Register here
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">Register</h2>
            <form className="space-y-3">
              <input
                type="text"
                placeholder="ID Number"
                name="id_number"
                className="input input-bordered w-full"
                value={votersData.id_number || ""}
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="First Name"
                name="firstname"
                className="input input-bordered w-full"
                value={votersData.firstname || ""}
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastname"
                className="input input-bordered w-full"
                value={votersData.lastname || ""}
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="input input-bordered w-full"
                value={votersData.email || ""}
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="input input-bordered w-full"
                value={votersData.password || ""}
                onChange={handleChange}
              />

              <select
                className="select select-bordered w-full"
                name="gender"
                value={votersData.gender || ""}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Gender
                </option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <select
                className="select select-bordered w-full"
                name="year_level"
                value={votersData.year_level || ""}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Year Level
                </option>
                {yearLevels.map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>

              <select
                className="select select-bordered w-full"
                name="course"
                value={votersData.course || ""}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Course
                </option>
                {courses.map((course) => (
                  <option key={course}>{course}</option>
                ))}
              </select>

              <button className="btn btn-success w-full" onClick={handleSubmit}>
                Register
              </button>
            </form>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-500 underline"
              >
                Login here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
