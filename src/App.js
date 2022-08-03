import { useEffect } from "react";

import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import MainLayout from "./components/common/MainLayout";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Table from "./screens/Table";
import AddUser from "./screens/AddUser";
import AddCompany from "./screens/AddCompany";
import User from "./screens/User";
import Company from "./screens/Company";
import UserDeteil from "./screens/UserDeteil";
import SetUserDetail from "./screens/SetUserDetail";

import { getStorage } from "./Services/importData";
import { ISLOGIN } from "./Services/string";

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

  const fnNavEvent = (matches) => {
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
    if (!mql.matches) {
      fnNavEvent(!navChange);
    }
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
          path="/"
          element={<MainLayout nowTitle="DashBord" component={<Home />} />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/table"
          element={<MainLayout nowTitle="DashBord" component={<Table />} />}
        />
        <Route
          path="/user"
          element={<MainLayout nowTitle="관리자 관리" component={<User />} />}
        />
        <Route
          path="/adduser"
          element={
            <MainLayout nowTitle="관리자 추가" component={<AddUser />} />
          }
        />
        <Route
          path="/addcompany"
          element={
            <MainLayout nowTitle="사업자 추가" component={<AddCompany />} />
          }
        />
        <Route
          path="/userdetail"
          element={
            <MainLayout nowTitle="관리자 상세정보" component={<UserDeteil />} />
          }
        />
        <Route
          path="/setuserdetail"
          element={
            <MainLayout
              nowTitle="관리자 정보 업데이트"
              component={<SetUserDetail />}
            />
          }
        />
        <Route
          path="/company"
          element={
            <MainLayout nowTitle="사업자 관리" component={<Company />} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
