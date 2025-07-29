import { Route, Routes, useLocation } from "react-router-dom";
import Register from "./Register";
import Homepage from "./pages/Homepage";
import Sidebar from "./Sidebar";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CandidateForm from "./components/CandidatesForm";
import Candidates from "./pages/Candidates";
import PendingApplication from "./pages/PendingApplication";

const App = () => {
  const location = useLocation();

  // Check if the current route is homepage
  const isHomepage = location.pathname === "/";

  return (
    <div className="flex flex-rown m-h-screen lg:h-screen">
      {/* Only show Sidebar if not on homepage */}
      {!isHomepage && <Sidebar />}

      <div className={`flex-1 ${isHomepage ? "w-full" : ""}`}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/filecandidacy" element={<CandidateForm />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/pending-application" element={<PendingApplication />} />

          {/* Add more routes here */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
