/****  Code History Piste na Voting System Dashboard
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |    Sakamote_dev   | 07/21/2025    | Create Code
* N002 |    joshua-amaw    |               | 
 
 ****/

/*N001 Start*/
import React from "react";
import {
  FaUserGraduate,
  FaUserTie,
  FaCheckCircle,
  FaClipboardList,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const lineData = [
  { name: "Mon", votes: 200 },
  { name: "Tue", votes: 450 },
  { name: "Wed", votes: 300 },
  { name: "Thu", votes: 500 },
  { name: "Fri", votes: 650 },
];

const barData = [
  { name: "President", votes: 250 },
  { name: "VP", votes: 180 },
  { name: "Secretary", votes: 300 },
  { name: "Treasurer", votes: 200 },
];

const pieData = [
  { name: "Voted", value: 876 },
  { name: "Not Voted", value: 124 },
];

const COLORS = ["#34d399", "#f87171"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center m-h-screen">
      {/* Main Content */}
      <div className="flex-1 bg-base-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Voting System Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat bg-primary text-primary-content rounded-box shadow-md">
            <div className="stat-figure text-white">
              <FaUserGraduate size={30} />
            </div>
            <div className="stat-title">Total Students</div>
            <div className="stat-value">1,234</div>
          </div>

          <div className="stat bg-secondary text-secondary-content rounded-box shadow-md">
            <div className="stat-figure text-white">
              <FaUserTie size={30} />
            </div>
            <div className="stat-title">Candidates</div>
            <div className="stat-value">56</div>
          </div>

          <div className="stat bg-success text-success-content rounded-box shadow-md">
            <div className="stat-figure text-white">
              <FaCheckCircle size={30} />
            </div>
            <div className="stat-title">Voters Voted</div>
            <div className="stat-value">876</div>
          </div>

          <div className="stat bg-accent text-accent-content rounded-box shadow-md">
            <div className="stat-figure text-white">
              <FaClipboardList size={30} />
            </div>
            <div className="stat-title">Registered Voters</div>
            <div className="stat-value">1,000</div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-base-200 p-4 rounded-box shadow">
            <h2 className="text-lg font-semibold mb-4">Voting Over Days</h2>
            <LineChart width={300} height={200} data={lineData}>
              <Line type="monotone" dataKey="votes" stroke="#3b82f6" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </div>

          <div className="bg-base-200 p-4 rounded-box shadow">
            <h2 className="text-lg font-semibold mb-4">Votes per Position</h2>
            <BarChart width={300} height={200} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="votes" fill="#10b981" />
            </BarChart>
          </div>

          <div className="bg-base-200 p-4 rounded-box shadow">
            <h2 className="text-lg font-semibold mb-4">Voter Distribution</h2>
            <PieChart width={300} height={200}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}
