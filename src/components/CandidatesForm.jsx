import axios from "axios";
import React, { useState, useEffect } from "react";

export default function CandidateForm({ enabled }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    position: "",
    
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async() => {
    
    try {
      const response = await axios.post("http://localhost:3000/api/candidates", formData);
      if (response.data.retVal === 1) {
       
        alert("Candidacy filed successfully!");
        
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
        const response = await axios.get("http://localhost:3000/api/admin/getfilingstatus");
  
          const openStatus = response.data?.status;
          
          setIsOpenFiling(openStatus === "OPEN");
    
          console.log(response.data);
          
      } catch (error) {
        console.error("Error fetching filing status:", error);
        alert("An error occurred while fetching the filing status.");
      }
    }
   
    useEffect(() => {
      getFilingStatus();
    }, [])

  return (
    <>
     {isOpenFiling ? (
      <>
    <form className="bg-white p-4 rounded shadow w-1/2">
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
      <div className="mb-4">
        <label className="block font-semibold mb-1">Course</label>
        <input
          type="text"
          name="course"
          className="input input-bordered w-full"
          value={formData.course}
          onChange={handleChange}
        
          required
        />
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
          <option value="President">President</option>
          <option value="Vice President">Vice President</option>
          <option value="Secretary">Secretary</option>
        </select>
      </div>

      

      <button type="submit" className="btn btn-success w-full" onClick={handleSubmit}>
        File Candidacy
      </button>

     
    </form>
   
      </>
     ) : (
    <div className="text-center text-red-500">
            Filing period is closed. Please check back later.   
    </div>
      
      )}
    </>
  );
}
