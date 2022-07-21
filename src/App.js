import { useEffect } from "react";

import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import MainLayout from "./components/common/MainLayout";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Table from "./screens/Table";
import AddUser from "./screens/AddUser";
import { getStorage } from "./service/importData";
import { ISLOGIN } from "./service/string";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = getStorage(ISLOGIN);
  const navChange = useSelector((state) => state.navState);
  const dispatch = useDispatch();

  const userCheck = () => {
    const locationCheck = location.pathname !== "/login";
    if (!user && locationCheck) {
      navigate("/login");
      return;
    }
  };

  const fnNavEvent = (matches = !navChange) => {
    dispatch({
      type: "navEvent",
      payload: matches,
    });
  };
  const screenChange = (event) => {
    const matches = event.matches;
    fnNavEvent(matches);
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
          element={<MainLayout nowTitle="DashBord" component={<Home />} />}
        />
        <Route path={`${process.env.PUBLIC_URL}/login`} element={<Login />} />
        <Route
          path={`${process.env.PUBLIC_URL}/table`}
          element={<MainLayout nowTitle="DashBord" component={<Table />} />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/adduser`}
          element={<MainLayout nowTitle="AddUser" component={<AddUser />} />}
        />
      </Routes>
    </div>
  );
}

export default App;
