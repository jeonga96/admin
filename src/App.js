import { useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* 기본 레이아웃 & 기능 */
import MainLayout from "./components/layout/LayoutMain";
import Login from "./screens/login/Login";

/* 회원관리 */
import ListUser from "./screens/user/ListUser";
import AddUser from "./screens/user/AddUser";
import SetDetailUser from "./screens/user/SetDetailUser";

/* 사업자 관리 */
import ListCompany from "./screens/company/ListCompany";
import AddCompany from "./screens/company/AddCompany";
import SetDetailCompany from "./screens/company/SetDetailCompany";
import SetRequiredCompany from "./screens/company/SetRequiredCompany";
import DetailCompanyReview from "./screens/company/DetailCompanyReview";

/* 공지사항 - 사업자*/
import ListCompanyNotice from "./screens/company/ListCompanyNotice";
import DetailNotice from "./screens/notice/DetailNotice";
import SetCompanyNotice from "./screens/company/SetDetailCompanyNotice";

/* 견적요청서 관리 */
import ListEstimateinfo from "./screens/estimateinfo/ListEstimateinfo";
import SetAdminEstimateinfo from "./screens/estimateinfo/SetAdminEstimateinfo";
import DetailCompanyEstimateinfo from "./screens/company/ListCompanyEstimateinfo";

/* 견적서 관리 */
import ListProposalinfo from "./screens/proposalInfo/ListProposalinfo";
import SetAdminProposalInfo from "./screens/proposalInfo/SetAdminProposalInfo";
import DetailCompanyProposalinfo from "./screens/company/ListCompanyProposalinfo";

/* 공지사항 - 관리자*/
import ListAdminNotice from "./screens/notice/ListAdminNotice";
import SetAdminNotice from "./screens/notice/SetAdminNotice";

/* 리뷰 */
import ListCompanyReview from "./screens/company/ListCompanyReview";

/* 앱관리 */
import SetAdminAppbanner from "./screens/appbanner/SetAdminAppbanner";

/* 키워드 조회량 관리 */
// import SetAdminKeywords from "./screens/develop/SetAdminKeywords";

/* 유통만 관리 */
import ListAgentEm from "./screens/agent/ListAgentEm";
import SetAgentEm from "./screens/agent/SetAgentEm";
import ListAgentAg from "./screens/agent/ListAgentAg";
import ListAgentSd from "./screens/agent/ListAgentSd";
import SetAgentSd from "./screens/agent/SetAgentSd";
import SetAgentAg from "./screens/agent/SetAgentAg";

/* 이밴트 */
import ListEvent from "./screens/event/ListEvent";
import SetEvent from "./screens/event/SetEvent";

// 안심번호
import List050Ment from "./screens/develop/List050Ment";
import Set050Biz from "./screens/company/Set050Biz";
import Set050Ment from "./screens/company/Set050Ment";

import * as API from "./service/api";
import * as ST from "./service/storage";
import * as STR from "./service/string";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const ISUSER = ST.servicesGetStorage(STR.TOKEN);
  // const ISALLKEYWORD = ST.servicesGetStorage(STR.ALLKEYWORD);
  // const navChange = useSelector((state) => state.navState);
  // const dispatch = useDispatch();
  const notLoginScreens = location.pathname !== "/login";
  let currentPath = useRef("");

  const fnHomeLink = () => {
    navigate("/user");
  };

  // 로컬에 token이 없으면서 현재 페이지가 login이 아닐 때
  const fnUserCheck = () => {
    if (!ISUSER && notLoginScreens) {
      navigate("/login");
      return;
    }
  };

  // const fnNavEvent = (matches) => {
  //   dispatch({
  //     type: "serviceNav",
  //     payload: matches,
  //   });
  // };

  // const fnScreenEvent = (event) => {
  //   const matches = event.matches;
  //   fnNavEvent(matches);
  // };

  useEffect(() => {
    // url "/"을 통합회원관리로 이동하도록 설정
    if (location.pathname === "/") {
      fnHomeLink();
    }
    // 네비게이션 반응형
    // let mql = window.matchMedia("screen and (min-width:992px)");
    // if (!mql.matches) {
    //   fnNavEvent(!navChange);
    // }
    // mql.addEventListener("change", fnScreenEvent);
    // return () => mql.removeEventListener("change", fnScreenEvent);
  }, []);

  useEffect(() => {
    // 로컬에 token이 없으면서 현재 페이지가 login이 아닐 때면 login 으로 이동
    fnUserCheck();

    // 키워드 검색을 위해 전체 키워드 받아와 로컬스토리지에 저장
    // if (!!ISUSER & !ISALLKEYWORD) {
    // API.servicesPostData(STR.urlAllKeyword, {}).then((res) => {
    //   ST.servicesSetStorage(STR.ALLKEYWORD, JSON.stringify(res.data));
    // });
    // }

    //refresh token 다시 받아오기 이벤트, 현재 10시간마다 토큰을 받아오는 것으로 설정
    if (notLoginScreens) {
      const tokenCheckTime = 3600000 * 10;
      setTimeout(API.servicesGetRefreshToken, tokenCheckTime);
    }
  }, []);

  // 현재 link path를 클릭했을 때 새로고침
  useEffect(() => {
    if (currentPath.current === location.pathname) window.location.reload();
    currentPath.current = location.pathname;
  }, [location]);

  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route
          path="/"
          element={<MainLayout nowTitle="회원 관리" component={<ListUser />} />}
        />
        <Route path="login" element={<Login />} />
        <Route
          path="user"
          element={<MainLayout nowTitle="회원 관리" component={<ListUser />} />}
        />
        {/* ------- 회원 관리 ------- */}
        <Route
          path="user/:uid"
          element={
            <MainLayout
              nowTitle="회원 상세정보"
              component={<SetDetailUser />}
            />
          }
        />
        <Route
          path="user/add"
          element={<MainLayout nowTitle="회원 추가" component={<AddUser />} />}
        />
        {/* ------- 사업자 관리 ------- */}
        <Route
          path="company/add"
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
        <Route
          path="company/:cid/req"
          element={
            <MainLayout
              nowTitle="사업자 필수정보"
              component={<SetRequiredCompany />}
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
              component={<DetailNotice />}
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
        {/* ------- 견적 요청서 관리 ------- */}
        <Route
          path="estimateinfo"
          element={
            <MainLayout
              nowTitle="공사콕 견적의뢰서"
              component={<ListEstimateinfo />}
            />
          }
        />
        <Route
          path="estimateinfo/add"
          element={
            <MainLayout
              nowTitle="공사콕 견적의뢰서 추가"
              component={<SetAdminEstimateinfo />}
            />
          }
        />
        <Route
          path="estimateinfo/:esid"
          element={
            <MainLayout
              nowTitle="공사콕 견적의뢰서 상세 관리"
              component={<SetAdminEstimateinfo />}
            />
          }
        />
        <Route
          path="company/:rcid/toestimateinfo"
          element={
            <MainLayout
              nowTitle="[요청] 공사콕 견적의뢰서"
              component={<DetailCompanyEstimateinfo />}
            />
          }
        />
        <Route
          path="company/:rcid/fromestimateinfo"
          element={
            <MainLayout
              nowTitle="[수령] 공사콕 견적의뢰서"
              component={<DetailCompanyEstimateinfo />}
            />
          }
        />
        {/* ------- 견적서 관리 ------- */}
        <Route
          path="proposalInfo"
          element={
            <MainLayout
              nowTitle="공사콕 견적서"
              component={<ListProposalinfo />}
            />
          }
        />
        <Route
          path="proposalInfo/add"
          element={
            <MainLayout
              nowTitle="공사콕 견적서 추가"
              component={<SetAdminProposalInfo />}
            />
          }
        />
        <Route
          path="proposalInfo/:prid"
          element={
            <MainLayout
              nowTitle="공사콕 견적서 상세 관리"
              component={<SetAdminProposalInfo />}
            />
          }
        />
        <Route
          path="company/:rcid/toproposalinfo"
          element={
            <MainLayout
              nowTitle="[요청] 공사콕 견적서"
              component={<DetailCompanyProposalinfo />}
            />
          }
        />
        <Route
          path="company/:rcid/fromproposalinfo"
          element={
            <MainLayout
              nowTitle="[수령] 공사콕 견적서"
              component={<DetailCompanyProposalinfo />}
            />
          }
        />

        {/* --------------앱관리 --------------*/}
        {/* ------- 공지사항 관리 ------- */}
        <Route
          path="notice"
          element={
            <MainLayout
              nowTitle="공사콕 공지사항"
              component={<ListAdminNotice />}
            />
          }
        />
        <Route
          path="notice/set"
          element={
            <MainLayout
              nowTitle="공사콕 공지사항 작성"
              component={<SetAdminNotice />}
            />
          }
        />
        <Route
          path="notice/:contid"
          element={
            <MainLayout
              nowTitle="공사콕 공지사항"
              component={<DetailNotice />}
            />
          }
        />
        <Route
          path="notice/:contid/set"
          element={
            <MainLayout
              nowTitle="공사콕 공지사항 수정"
              component={<SetAdminNotice />}
            />
          }
        />
        {/* ------- 배너 관리 ------- */}
        <Route
          path="appbanner"
          element={
            <MainLayout
              nowTitle="공사콕 배너관리"
              component={<SetAdminAppbanner />}
            />
          }
        />
        {/* ------- 배너 관리 ------- */}
        <Route
          path="event"
          element={
            <MainLayout
              nowTitle="공사콕 이벤트 관리"
              component={<ListEvent />}
            />
          }
        />
        <Route
          path="event/set"
          element={
            <MainLayout
              nowTitle="공사콕 이벤트 작성"
              component={<SetEvent />}
            />
          }
        />
        <Route
          path="event/:contid/set"
          element={
            <MainLayout
              nowTitle="공사콕 이벤트 작성"
              component={<SetEvent />}
            />
          }
        />
        {/* ------- 키워드 조회량 관리 ------- */}
        {/* <Route
          path="setkeywords"
          element={
            <MainLayout
              nowTitle="공사콕 키워드 검색순위 관리"
              component={<SetAdminKeywords />}
            />
          }
        /> */}

        {/* --------------유통망관리 --------------*/}
        {/* ------- 사원 관리 ------- */}
        <Route
          path="agentem"
          element={
            <MainLayout nowTitle="사원 관리" component={<ListAgentEm />} />
          }
        />
        <Route
          path="agentem/:uid"
          element={
            <MainLayout nowTitle="사원 수정" component={<SetAgentEm />} />
          }
        />
        <Route
          path="agentem/add"
          element={
            <MainLayout nowTitle="사원 등록" component={<SetAgentEm />} />
          }
        />
        {/* ------- 지사 총판 관리 ------- */}
        <Route
          path="agentsd"
          element={
            <MainLayout
              nowTitle="지사 ( 총판 ) 관리"
              component={<ListAgentSd />}
            />
          }
        />
        <Route
          path="agentsd/add"
          element={
            <MainLayout
              nowTitle="지사 ( 총판 ) 등록"
              component={<SetAgentSd />}
            />
          }
        />
        <Route
          path="agentsd/:uid"
          element={
            <MainLayout
              nowTitle="지사 ( 총판 ) 수정"
              component={<SetAgentSd />}
            />
          }
        />
        {/* ------- 지점 ( 대리점 ) 관리 ------- */}
        <Route
          path="agentag"
          element={
            <MainLayout
              nowTitle="지점 ( 대리점 ) 관리"
              component={<ListAgentAg />}
            />
          }
        />
        <Route
          path="agentag/add"
          element={
            <MainLayout
              nowTitle="지점 ( 대리점 ) 등록"
              component={<SetAgentAg />}
            />
          }
        />
        <Route
          path="agentag/:uid"
          element={
            <MainLayout
              nowTitle="지점 ( 대리점 ) 수정"
              component={<SetAgentAg />}
            />
          }
        />

        {/* ------- 안심번호 ------- */}
        <Route
          path="company/:cid/050biz"
          element={
            <MainLayout nowTitle="안심번호 등록" component={<Set050Biz />} />
          }
        />
        <Route
          path="company/:cid/050biz/:vno"
          element={
            <MainLayout nowTitle="안심번호 수정" component={<Set050Biz />} />
          }
        />

        {/* 외부 사이트 연결로 인한 Nav 숨김 처리 */}
        <Route
          path="050ment"
          element={
            <MainLayout
              nowTitle="안심번호 멘트 관리"
              component={<List050Ment />}
            />
          }
        />
        <Route
          path="050ment/add"
          element={
            <MainLayout
              nowTitle="안심번호 멘트 추가"
              component={<Set050Ment />}
            />
          }
        />
        <Route
          path="050ment/:mentid"
          element={
            <MainLayout
              nowTitle="안심번호 멘트 수정"
              component={<Set050Ment />}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
