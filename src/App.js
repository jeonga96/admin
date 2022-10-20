import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

/* 기본 레이아웃 & 기능 */
import MainLayout from "./components/common/LayoutMain";
import Home from "./screens/Home";
import Login from "./screens/Login";

/* 회원관리 */
import ListUser from "./screens/ListUser";
import AddUser from "./screens/AddUser";
import SetDetailUser from "./screens/SetDetailUser";

/* 사업자 관리 */
import ListCompany from "./screens/ListCompany";
import AddCompany from "./screens/AddCompany";
import SetDetailCompany from "./screens/SetDetailCompany";

/* 공지사항 */
import ListCompanyNotice from "./screens/ListCompanyNotice";
import DetailCompanyNotice from "./screens/DetailCompanyNotice";
import SetCompanyNotice from "./screens/SetDetailCompanyNotice";

/* 앱관리 */
import ListAdminNotice from "./screens/ListAdminNotice";
import DetailAdminNotice from "./screens/DetailAdminNotice";
import SetDetailAdminNotice from "./screens/SetDetailAdminNotice";
import SetAdminAppbanner from "./screens/SetAdminAppbanner";

/* 리뷰 */
import ListCompanyReview from "./screens/ListCompanyReview";
import DetailCompanyReview from "./screens/DetailCompanyReview";

import {
  servicesGetStorage,
  servicesGetRefreshToken,
  servicesPostData,
  servicesSetStorage,
} from "./Services/importData";
import { urlAllKeyword, TOKEN, ALLKEYWORD } from "./Services/string";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const ISUSER = servicesGetStorage(TOKEN);
  const ISALLKEYWORD = servicesGetStorage(ALLKEYWORD);
  const navChange = useSelector((state) => state.navState);
  const dispatch = useDispatch();
  const notLoginScreens = location.pathname !== "/login";

  // 로컬에 token이 없으면서 현재 페이지가 login이 아닐 때
  const userCheck = () => {
    if (!ISUSER && notLoginScreens) {
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

  // 네비게이션 반응형
  useEffect(() => {
    let mql = window.matchMedia("screen and (min-width:992px)");
    if (!mql.matches) {
      fnNavEvent(!navChange);
    }
    mql.addEventListener("change", screenChange);
    return () => mql.removeEventListener("change", screenChange);
  }, []);

  useEffect(() => {
    // 로컬에 token이 없으면서 현재 페이지가 login이 아닐 때면 login 으로 이동
    userCheck();

    // 키워드 검색을 위해 전체 키워드 받아와 로컬스토리지에 저장
    if (!!ISUSER & !ISALLKEYWORD) {
      servicesPostData(urlAllKeyword, {}).then((res) => {
        servicesSetStorage(ALLKEYWORD, JSON.stringify(res.data));
      });
    }

    //refresh token 다시 받아오기 이벤트, 현재 10시간마다 토큰을 받아오는 것으로 설정
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
          element={
            <MainLayout nowTitle="통합회원 관리" component={<ListUser />} />
          }
        />
        {/* ------- 회원 관리 ------- */}
        <Route
          path="user/:uid"
          element={
            <MainLayout
              nowTitle="통합회원 상세정보"
              component={<SetDetailUser />}
            />
          }
        />

        <Route
          path="adduser"
          element={
            <MainLayout nowTitle="통합회원 추가" component={<AddUser />} />
          }
        />
        {/* ------- 사업자 관리 ------- */}
        <Route
          path="addcompany"
          element={
            <MainLayout nowTitle="사업자 추가" component={<AddCompany />} />
          }
        />

        <Route
          path="company"
          element={
            <MainLayout nowTitle="사업자 관리" component={<ListCompany />} />
          }
        ></Route>
        <Route
          path="company/:cid"
          element={
            <MainLayout
              nowTitle="사업자 상세정보"
              component={<SetDetailCompany />}
            />
          }
        />
        {/* ------- 공지사항 ------- */}
        <Route
          path="company/:cid/notice"
          element={
            <MainLayout
              nowTitle="사업자 공지사항"
              component={<ListCompanyNotice />}
            />
          }
        />
        <Route
          path="company/:cid/notice/set"
          element={
            <MainLayout
              nowTitle="사업자 공지사항 작성"
              component={<SetCompanyNotice />}
            />
          }
        />
        <Route
          path="company/:cid/notice/:comnid"
          element={
            <MainLayout
              nowTitle="사업자 공지사항"
              component={<DetailCompanyNotice />}
            />
          }
        />
        <Route
          path="company/:cid/notice/:comnid/set"
          element={
            <MainLayout
              nowTitle="사업자 공지사항 수정"
              component={<SetCompanyNotice />}
            />
          }
        />

        {/* ------- 리뷰 ------- */}
        <Route
          path="company/:cid/review"
          element={
            <MainLayout
              nowTitle="사업자 리뷰"
              component={<ListCompanyReview />}
            />
          }
        />
        <Route
          path="company/:cid/review/:comrid"
          element={
            <MainLayout
              nowTitle="사업자 리뷰"
              component={<DetailCompanyReview />}
            />
          }
        />
        {/* ------- 공사콕 앱관리 ------- */}
        <Route
          path="noticelist"
          element={
            <MainLayout
              nowTitle="공사콕 공지사항"
              component={<ListAdminNotice />}
            />
          }
        />
        <Route
          path="addnotice"
          element={
            <MainLayout
              nowTitle="공사콕 공지사항 작성"
              component={<SetDetailAdminNotice />}
            />
          }
        />
        <Route
          path="notice/:contid"
          element={
            <MainLayout
              nowTitle="공사콕 공지사항"
              component={<DetailAdminNotice />}
            />
          }
        />
        <Route
          path="notice/:contid/modify"
          element={
            <MainLayout
              nowTitle="공사콕 공지사항 수정"
              component={<SetDetailAdminNotice />}
            />
          }
        />
        <Route
          path="appbanner"
          element={
            <MainLayout
              nowTitle="공사콕 배너관리"
              component={<SetAdminAppbanner />}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
