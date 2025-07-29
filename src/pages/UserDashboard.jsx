import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center lg:m-h-screen h-screen">
      <div className="flex flex-col  items-center gap-8">
        <div className="text-4xl mt-8 font-bold tracking-wider ">
          Smart Vote
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 ">
            <div className="flex justify-center items-center bg-primary text-primary-content rounded-box shadow-md shadow-gray-400 w-96 h-40 ">
              {/* <div className="text-white">
                <FaUserGraduate size={30} />
              </div> */}
              <div className="text-3xl font-bold">Vote Now</div>
            </div>

            <div
              className="flex justify-center items-center bg-secondary text-primary-content rounded-box shadow-md shadow-gray-400 w-96 h-40 cursor-pointer"
              onClick={() => navigate("/filecandidacy")}
            >
              <div className="text-3xl font-bold">File Candidacy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
