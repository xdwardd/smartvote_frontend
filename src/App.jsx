import React, { use, useState } from "react";
import Register from "./Register";
import Recognition from "./Recognition";
import Dashboard from "./assets/components/Dashboard";
import Login from "./assets/components/Login";
import Registration from "./assets/components/Registration";

const App = () => {
  // const [page, setPage] = useState("register");

  // return (
  //   <div>
  //     <nav className="flex justify-center gap-4 p-4 bg-gray-200">
  //       <button
  //         onClick={() => setPage("register")}
  //         className="px-4 py-2 bg-blue-500 text-white rounded"
  //       >
  //         Register
  //       </button>
  //       <button
  //         onClick={() => setPage("recognition")}
  //         className="px-4 py-2 bg-green-500 text-white rounded"
  //       >
  //         Recognize
  //       </button>
  //     </nav>

  //     {page === "register" ? <Register /> : <Recognition />}
  //   </div>
  // );

    const [activePage, setActivePage] = useState("login");
   const [name, setName] = useState("");
  let content = null;
  switch (activePage) {
    case "dashboard":
      content = <Dashboard setActivePage={setActivePage} name={name}/>;
      break;

    case "login":
      content = <Login setActivePage={setActivePage} setName={setName}/>;
      break;

    case "register":
      content = <Registration setActivePage={setActivePage}/>;
      break;

    default:
      break;
  }

   return (
  
      <>
        {content}
      </>
   
  );
};

export default App;
