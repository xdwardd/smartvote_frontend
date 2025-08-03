import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loaders } from "../utils/Loaders";
import { FaCheck } from "react-icons/fa";

export default function CandidateForm({ enabled }) {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const [selected, setSelected] = useState("");
  const [org, setOrg] = useState(null);
  useEffect(() => {
    if (!userData?.course) return;

    switch (userData.course) {
      case "BSIT":
        setOrg("CCS");
        break;
      case "BEED":
      case "BSED":
        setOrg("CTE");
        break;
      case "BSA":
      case "BSAT":
      case "HM":
        setOrg("CBA");
        break;
      case "PSYCHOLOGY":
        setOrg("PSYCHOLOGY");
        break;
      case "CRIMINOLOGY":
        setOrg("CJE");
      default:
        setOrg(null);
    }
  }, [userData?.course]);

  const orgOptions = [
    { id: 1, label: "SSG", value: "SSG" },
    ...(org ? [{ id: 2, label: org, value: org }] : []),
  ];

  const position = [
    { id: 1, value: "President" },
    { id: 2, value: "Vice President" },
    { id: 3, value: "Secretary" },
    { id: 4, value: "Treasurer" },
    { id: 5, value: "Auditor" },
    { id: 6, value: "MMO" },
  ];

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: userData.firstname,
    lastname: userData.lastname,
    email: userData.email,
    course: userData.course,
    position: "",
    advocacy: "",
    organization: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      organization: selected,
    }));
  }, [selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    if (formData.position == "" || formData.advocacy == "") {
      toast.error("Fill up all fields!");
      return;
    }

    if (formData.organization === "") {
      toast.error("Please select an organization!");
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
      // console.error("Error fetching filing status:", error);
      alert("An error occurred while fetching the filing status.");
    }
  };

  useEffect(() => {
    getFilingStatus();
  }, []);

  return (
    <div className="relative lg:m-h-screen h-screen">
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
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-semibold mb-1">FirstName</label>
                  <input
                    type="text"
                    firstname="firstname"
                    className="input input-bordered w-full"
                    value={formData.firstname}
                    onChange={handleChange}
                    readOnly
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">LastName</label>
                  <input
                    type="text"
                    lastname="lastname"
                    className="input input-bordered w-full"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <input
                    type="text"
                    name="email"
                    className="input input-bordered w-full"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Course</label>
                  <input
                    type="text"
                    name="course"
                    className="input input-bordered w-full"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                </div>
              </div>

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
                <div className="font-semibold">Advocacy</div>
                <textarea
                  name="advocacy"
                  value={userData.advocacy}
                  className="textarea w-full"
                  placeholder="Advocacy"
                  onChange={handleChange}
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold">Organization</label>
                <div className="flex space-x-4 mt-2">
                  {orgOptions.map((item) => (
                    <div
                      key={item.id}
                      name="organization"
                      className={`relative p-2 mb-4 border rounded-lg cursor-pointer w-32 text-center transition-all duration-200
                      ${
                        selected === item.value
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-300"
                      }`}
                      onClick={() => setSelected(item.value)}
                    >
                      <span className="text-lg font-medium">{item.label}</span>
                      {selected === item.value && (
                        <FaCheck className="absolute top-1 right-1 text-blue-600 w-4 h-4" />
                      )}
                    </div>
                  ))}
                </div>
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
