import { useState, useEffect } from "react";

import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Home from "./screens/Home";
import Login from "./screens/Login";
import Table from "./screens/Table";
import { getStorage } from "./service/importData";
import { ISLOGIN } from "./service/string";

function App() {
  const [btn, setBtn] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStorage(ISLOGIN);

  const userCheck = () => {
    const locationCheck = location.pathname !== "/login";
    if (!user && locationCheck) {
      navigate("/login");
      return;
    }
  };

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

  useEffect(() => {
    userCheck();
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route
          path={`${process.env.PUBLIC_URL}/`}
          element={<Home btn={btn} fnBtn={fnBtn} />}
        />
        <Route path={`${process.env.PUBLIC_URL}/login`} element={<Login />} />
        <Route
          path={`${process.env.PUBLIC_URL}/table`}
          element={<Table btn={btn} fnBtn={fnBtn} />}
        />
      </Routes>
    </div>
  );
}

export default App;
