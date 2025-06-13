import React, { useState } from "react";
import Register from "./Register";
import Recognition from "./Recognition";

const App = () => {
  const [page, setPage] = useState("register");

  return (
    <div>
      <nav className="flex justify-center gap-4 p-4 bg-gray-200">
        <button
          onClick={() => setPage("register")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Register
        </button>
        <button
          onClick={() => setPage("recognition")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Recognize
        </button>
      </nav>

      {page === "register" ? <Register /> : <Recognition />}
    </div>
  );
};

export default App;
