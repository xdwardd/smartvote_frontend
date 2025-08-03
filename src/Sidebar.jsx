import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { setLogging } from "tesseract.js";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData);

  const admin = userData.firstname == "Admin";
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="w-64 bg-gradient-to-br from-blue-100 to-blue-300  p-4  flex flex-col justify-between h-screen">
      {/* Top Section */}
      <div>
        <div className="flex flex-col items-center gap-3 mb-6 ">
          <FaUserCircle size={36} className="text-primary" />
          <div>
            <h2 className="text-lg font-bold leading-none text-center">
              {userData.firstname} {userData.lastname}
            </h2>
            <p className="text-xs text-gray-500 text-center mt-2">
              {userData.course} - {userData.year_level}
            </p>
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>
        </div>
        {admin ? (
          <ul className="menu rounded-box p-2 w-full flex flex-col gap-4">
            <li>
              <Link
                to="/admin-dashboard"
                className={`hover:bg-base-300 ${
                  isActive("/admin-dashboard") ? "bg-primary text-white" : ""
                }`}
              >
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/candidates"
                className={`hover:bg-base-300 ${
                  isActive("/candidates") ? "bg-primary text-white" : ""
                }`}
              >
                Candidates
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="menu rounded-box p-2 w-full flex flex-col gap-4">
            <li>
              <Link
                to="/user-dashboard"
                className={`hover:bg-base-300 ${
                  isActive("/user-dashboard") || isActive("/filecandidacy")
                    ? "bg-primary text-white"
                    : ""
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/pending-application"
                className={`hover:bg-base-300 ${
                  isActive("/pending-application")
                    ? "bg-primary text-white"
                    : ""
                }`}
              >
                Pending Application
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Bottom Logout */}
      <div className="">
        <button
          className="btn btn-sm btn-error w-full flex justify-between items-center"
          onClick={handleLogout}
        >
          <span>Logout</span>
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
}
