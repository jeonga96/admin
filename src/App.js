import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Table from "./screens/Table";
import { getSession } from "./service/importData";

function App() {
  const loginCheck = getSession("is_login");
  // function loginFuntion() {
  //   if (loginCheck === null) {
  //     document.location.href = "/login";
  //   }
  // }
  // loginFuntion();
  const [btn, setBtn] = useState(true);
  const fnBtn = (btn) => {
    setBtn(!btn);
  };

  const screenChange = (event) => {
    const matches = event.matches;
    setBtn(matches);
  };
  useEffect(() => {
    let mql = window.matchMedia("screen and (min-width:992px)");
    mql.addEventListener("change", screenChange);
    return () => mql.removeEventListener("change", screenChange);
  }, []);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home btn={btn} fnBtn={fnBtn} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/table" element={<Table btn={btn} fnBtn={fnBtn} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
