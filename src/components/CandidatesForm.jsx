import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loaders } from "../utils/Loaders";

export default function CandidateForm({ enabled }) {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const position = [
    { id: 1, value: "President" },
    { id: 2, value: "Vice President" },
    { id: 3, value: "Secretary" },
    { id: 4, value: "Treasurer" },
    { id: 5, value: "Auditor" },
    { id: 6, value: "MMO" },
  ];

  console.log(userData);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.firstname + " " + userData.lastname,
    email: userData.email,
    position: "",
    advocacy: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.position == "" || formData.advocacy == "") {
      toast.error("Fill up all fields!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/candidates",
        formData
      );
      if (response.data.retVal === 1) {
        setTimeout(() => {
          setLoading(false);
          toast.success("Successfully Submitted!");
          navigate("/user-dashboard");
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
      return;
    }
  };

  const [isOpenFiling, setIsOpenFiling] = useState(false);
  const getFilingStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/getfilingstatus"
      );

      const openStatus = response.data?.status;

      setIsOpenFiling(openStatus === "OPEN");

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching filing status:", error);
      alert("An error occurred while fetching the filing status.");
    }
  };

  useEffect(() => {
    getFilingStatus();
  }, []);

  console.log(isOpenFiling);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-30  bg-transparent  flex items-center justify-center">
          <Loaders />
        </div>
      )}

      {/* {isOpenFiling ? ( */}

      {!isOpenFiling ? (
        <div className="flex h-screen justify-center items-center ">
          <div className="text-2xl font-bold">
            Filing Of Candidacy in not available
          </div>
        </div>
      ) : (
        <>
          <div
            className={`flex flex-col gap-6 justify-center items-center h-screen w-full ${
              loading ? "pointer-events-none opacity-40" : "opacity-100"
            }`}
          >
            <div className="text-2xl font-bold">File Candidacy</div>
            <form className="bg-white p-4 rounded shadow w-1/2 border">
              <div className="mb-4">
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="text"
                  name="email"
                  className="input input-bordered w-full"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* <div className="mb-4">
              <label className="block font-semibold mb-1">Course</label>
              <input
                type="text"
                name="course"
                className="input input-bordered w-full"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </div> */}

              <div className="mb-4">
                <label className="block font-semibold mb-1">Position</label>
                <select
                  name="position"
                  className="select select-bordered w-full"
                  value={formData.position}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Position --</option>
                  {position.map((item) => (
                    <option key={item.id} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <textarea
                  name="advocacy"
                  value={userData.advocacy}
                  className="textarea w-full"
                  placeholder="Advocacy"
                  onChange={handleChange}
                ></textarea>
              </div>

              <button className="btn btn-success w-full" onClick={handleSubmit}>
                Submit
              </button>
            </form>
          </div>
        </>
      )}

      {/* ) : (
        <div className="text-center text-red-500">
          Filing period is closed. Please check back later.
        </div>
      )} */}
    </div>
  );
}
