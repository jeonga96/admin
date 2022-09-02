import { useEffect } from "react";

import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import MainLayout from "./components/common/MainLayout";
import Home from "./screens/Home";
import Login from "./screens/Login";

import User from "./screens/User";
import AddUser from "./screens/AddUser";
import UserMyInfo from "./screens/UserMyInfo";
import UserDetail from "./screens/UserDetail";
import CompanyMyDetail from "./screens/CompanyMyDetail";
import SetCompanyMyDetail from "./screens/SetCompanyMyDetail";
import SetUserMyInfo from "./screens/SetUserMyInfo";
import SetUserDetail from "./screens/SetUserDetail";

import Company from "./screens/Company";
import AddCompany from "./screens/AddCompany";
import CompanyDetail from "./screens/CompanyDetail";
import SetCompanyDetail from "./screens/SetCompanyDetail";

import {
  servicesGetStorage,
  servicesGetRefreshToken,
} from "./Services/importData";
import { TOKEN, urlRefreshtoken } from "./Services/string";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = servicesGetStorage(TOKEN);
  const navChange = useSelector((state) => state.navState);
  const dispatch = useDispatch();

  const notLoginScreens = location.pathname !== "/login";
  const userCheck = () => {
    if (!user && notLoginScreens) {
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

    //refresh token
    if (notLoginScreens) {
      const tokenCheckTime = 3600000 * 10;
      setTimeout(servicesGetRefreshToken, tokenCheckTime);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout
              nowTitle="DashBord"
              component={<Home nowTitle="DashBord" />}
            />
          }
        />
        <Route path="login" element={<Login />} />
        <Route
          path="user"
          element={<MainLayout nowTitle="통합회원 관리" component={<User />} />}
        />
        <Route
          path="user/:uid"
          element={
            <MainLayout
              nowTitle="통합회원 상세정보 관리"
              component={<UserDetail />}
            />
          }
        />

        <Route
          path="user/:uid/setuserdetail"
          element={
            <MainLayout
              nowTitle="통합회원 상세정보 수정"
              component={<SetUserDetail />}
            />
          }
        />
        <Route
          path="adduser"
          element={
            <MainLayout nowTitle="통합회원 추가" component={<AddUser />} />
          }
        />
        <Route
          path="addcompany"
          element={
            <MainLayout nowTitle="사업자 추가" component={<AddCompany />} />
          }
        />
        <Route
          path="usermyinfo"
          element={
            <MainLayout nowTitle="내 정보 확인" component={<UserMyInfo />} />
          }
        />
        <Route
          path="setusermyinfo"
          element={
            <MainLayout nowTitle="내 정보 수정" component={<SetUserMyInfo />} />
          }
        />
        <Route
          path="companymydetail"
          element={
            <MainLayout
              nowTitle="우리 회사 정보 확인"
              component={<CompanyMyDetail />}
            />
          }
        />
        <Route
          path="setcompanymydetail"
          element={
            <MainLayout
              nowTitle="우리 회사 정보 수정"
              component={<SetCompanyMyDetail />}
            />
          }
        />
        <Route
          path="company"
          element={
            <MainLayout nowTitle="사업자 관리" component={<Company />} />
          }
        ></Route>
        <Route
          path="company/:cid"
          element={
            <MainLayout
              nowTitle="사업자 상세정보 관리"
              component={<CompanyDetail />}
            />
          }
        />
        <Route
          path="company/:cid/setcompanydetail"
          element={
            <MainLayout
              nowTitle="사업자 상세정보 수정"
              component={<SetCompanyDetail />}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
