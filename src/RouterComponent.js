import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Home from "./screens/Home";
import Login from "./screens/Login";
import Table from "./screens/Table";
import { getSession } from "./service/importData";
import { ISLOGIN } from "./service/string";

function RouterComponent({ btn, fnBtn }) {
  const location = useLocation();
  const navigate = useNavigate();

  const user = getSession(ISLOGIN);
  console.log("userCheck확인중", !user);

  const userCheck = () => {
    const user = getSession(ISLOGIN);
    const locationCheck = location.pathname !== "/login";
    if (!user && locationCheck) {
      navigate("/login");
      return;
    }
  };
  useEffect(() => {
    console.log("바뀌었다!");
    userCheck();
  }, []);

  return (
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
  );
}

export default RouterComponent;
