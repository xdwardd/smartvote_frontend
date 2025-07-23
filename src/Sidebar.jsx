import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import React from "react";

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-slate-400 p-4 h-screen flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <FaUserCircle size={36} className="text-primary" />
          <div>
            <h2 className="text-lg font-bold leading-none">TestUser</h2>
            <p className="text-sm text-gray-500">test@vote.com</p>
          </div>
        </div>

        <ul className="menu rounded-box p-2 w-full flex flex-col gap-4">
          <li>
            <Link
              to="/"
              className={`hover:bg-base-300 ${
                isActive("/") ? "bg-primary text-white" : ""
              }`}
            >
              Dashboard
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
          <li>
            <Link
              to="/students"
              className={`hover:bg-base-300 ${
                isActive("/students") ? "bg-primary text-white" : ""
              }`}
            >
              Students
            </Link>
          </li>
        
          <li>
            <Link
              to="/voters"
              className={`hover:bg-base-300 ${
                isActive("/voters") ? "bg-primary text-white" : ""
              }`}
            >
              Voters
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`hover:bg-base-300 ${
                isActive("/settings") ? "bg-primary text-white" : ""
              }`}
            >
              Settings
            </Link>
          </li>
        </ul>
      </div>

      {/* Bottom Logout */}
      <div className="">
        <button className="btn btn-sm btn-error w-full flex justify-between items-center">
          <span>Logout</span>
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
}
