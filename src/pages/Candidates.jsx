import axios from "axios";
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
// import CandidatesForm from "../components/CandidatesForm";

export default function Candidates() {
  // const [formEnabled, setFormEnabled] = useState(false);
  // const [secretKey, setSecretKey] = useState("");
  // const [storedKey] = useState("12345"); // change this in real use
  // const [deadline, setDeadline] = useState(null);

  const [isOpenFiling, setIsOpenFiling] = useState(false);
  const [endDate, setEndDate] = useState(null);

  const getFilingStatus = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/getfilingstatus");

        const openStatus = response.data?.status;
        
        setIsOpenFiling(openStatus === "OPEN");
        setEndDate(formatToLocalIsoString(response.data?.end_date));
        console.log(response.data);
        
    } catch (error) {
      console.error("Error fetching filing status:", error);
      alert("An error occurred while fetching the filing status.");
    }
  }
 
  useEffect(() => {
    getFilingStatus();
  }, [])
  



  
  function formatDateTimeReadable(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);

  const pad = (n) => String(n).padStart(2, '0');

  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

function formatToLocalIsoString(dateString) {
  const date = new Date(dateString);

  const pad = (n) => String(n).padStart(2, "0");

  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
}


  const [data, setData] = useState({
    secretkey: "",
    admin_id: "testAdmin",
    start_date: new Date().toISOString(),
    end_date: "",
    status: "OPEN",
   
  })

  
function toDatetimeLocal(value) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}



  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: name === "end_date" ? new Date(value).toISOString() : value,
    }));
  }

  const handleSumbit = async () => {

    if (data.secretkey == "") {
      alert("Secret key is required.");
      return;
    }

    if (data.end_date == "") {
      alert("Please set a deadline.");
      return;
    } 
console.log(formatDateTimeReadable(data.end_date));

    // Simulate form submission

    try {
      
      const response = await axios.post("http://localhost:3000/api/admin/openfiling", 
        {...data, start_date:formatDateTimeReadable(data.start_date), end_date: formatDateTimeReadable(data.end_date)},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
  
      if (response.data.retVal === 1 ){

        alert("Filing of cadidacy is now open.");
        window.location.reload();
      } else {
        alert(response.data.resmsg)
      }
   
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form."); 
    }
    
  };


// console.log(endDate);

  const deadline = new Date("2025-07-30T18:12:54");
  console.log(deadline);
  
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(deadline));

  function getTimeRemaining(endTime) {
    const total = endTime - new Date();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { total, days, hours, minutes, seconds };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = getTimeRemaining(deadline);
      if (newTime.total <= 0) {
        clearInterval(interval);
      }
      setTimeLeft(newTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  
//Get all candidates

const [candidates, setCandidates] = useState([]);
const getCandidates = async () => {
   try {
    const response = await axios.get("http://localhost:3000/api/candidates/get-candidates");
    setCandidates(response.data); 
   } catch (error) {
     console.error("Error fetching candidates:", error);
     alert("An error occurred while fetching candidates.");
    
   }
}

useEffect(() => {
  getCandidates();  
},[]);


  const handleActionFiledCoC = (id, newStatus) => {
 
    const statusActions = newStatus === "Accepted" ? "Accept" : "Reject";
    
    const confirmMessage = `Are you sure you want to ${statusActions} this candidate?`;
    if (window.confirm(confirmMessage)) {
      axios.post("http://localhost:3000/api/candidates/update-filed-coc", {
        id,
        status: newStatus,
        approved_by: "Admin", // Replace with actual admin ID if needed
      })
      .then(response => {
        if (response.data.retVal === 1) {
          alert(`Candidate has been ${newStatus.toLowerCase()} successfully.`);
          getCandidates(); // Refresh candidates list
        } else {
          alert(response.data.resmsg);
        }
      })
      .catch(error => {
        console.error("Error updating candidate status:", error);
        alert("An error occurred while updating candidate status.");
      });
    }
    
  };



    return (

     <>
       {/* <Sidebar/> */}
      {isOpenFiling ? (
        <div className="flex flex-col items-center h-screen">
            <div className="text-2xl font-bold mt-4">Filing Of Candidacy End in</div>
              <div className="grid grid-flow-col gap-5 text-center auto-cols-max mt-10">
              <div className="flex flex-col p-4 bg-neutral text-neutral-content rounded-box">
              <span className="countdown font-mono text-5xl">
                <span style={{ "--value": timeLeft.days }}>{timeLeft.days}</span>
              </span>
              days
            </div>
            <div className="flex flex-col p-4 bg-neutral text-neutral-content rounded-box">
              <span className="countdown font-mono text-5xl">
                <span style={{ "--value": timeLeft.hours }}>{timeLeft.hours}</span>
              </span>
              hours
            </div>
            <div className="flex flex-col p-4 bg-neutral text-neutral-content rounded-box">
              <span className="countdown font-mono text-5xl">
                <span style={{ "--value": timeLeft.minutes }}>{timeLeft.minutes}</span>
              </span>
              min
            </div>
            <div className="flex flex-col p-4 bg-neutral text-neutral-content rounded-box">
              <span className="countdown font-mono text-5xl">
                <span style={{ "--value": timeLeft.seconds }}>{timeLeft.seconds}</span>
              </span>
              sec
            </div>
            </div>
            
            {/* table */}
             <div className="overflow-x-auto mt-10 ">
              <div className="mb-2 text-lg font-bold">Candidates</div>
              <table className="table w-full border-1 rounded-lg">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Position</th>
                    <th>Date Filed</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((person, index) => (
                    <tr key={person.id}>
                      <th>{index + 1}</th>
                      <td>{person.name}</td>
                      <td>{person.email}</td>
                      <td>{person.course}</td>
                      <td>{person.position}</td>
                      <td>{person.filed_at}</td>
                      <td
                        className={
                          person.status === "Accepted"
                            ? "text-green-500 font-semibold"
                            : person.status === "Rejected"
                            ? "text-red-500 font-semibold"
                            : "text-yellow-500 font-semibold"
                        }
                      >
                        {person.status}
                      </td>
                      <td className="space-x-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleActionFiledCoC(person.id, "Accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleActionFiledCoC(person.id, "Rejected")}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>

      ) : (
        <>
          <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Candidate Filing</h2>

        {/* Admin Controls */}
        <div className="mb-6 bg-slate-100 p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2">Admin Controls</h3>
          <input
            type="text"
            placeholder="Enter secret key"
            className="input input-bordered w-full mb-2"
            name="secretkey"
            value={data.secretkey || ""}
            onChange={handleChange}
          />
        

          <label className="block mb-1 font-semibold">Set Deadline:</label>
          <input
            type="datetime-local"
            className="input input-bordered w-full"
            name="end_date"
             value={data.end_date ? toDatetimeLocal(data.end_date) : ""}
            onChange={handleChange}
          />
          {/* {deadline && (
            <p className="mt-2 text-sm text-gray-600">
              Filing ends on: {new Date(deadline).toLocaleString()}
            </p>
          )} */}
          <button className="btn btn-primary w-full mb-2 mt-4" onClick={handleSumbit}>
            Open Filing COC
          </button>
        </div>
        

        {/* Candidate Form */}
        {/* <CandidatesForm enabled={formEnabled} /> */}
      </div>
        </>
      )}
      {/* countdown */}
     

    
     </> 
    );
  }
