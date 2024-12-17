import { useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* 기본 레이아웃 & 기능 */
import MainLayout from "./components/layout/LayoutMain";
import Login from "./screens/login/Login";

/* 회원관리 */
import ListUser from "./screens/user/ListUser";
import AddUser from "./screens/user/AddUser";
import SetDetailUser from "./screens/user/SetDetailUser";
import SetCsvUpload from "./screens/csvUpload/SetCsvUpload";

/* 회원관리 - 탈퇴요청  */
import ListResignuser from "./screens/resignuser/ListResignuser";

/* 사업자 관리 */
import ListCompany from "./screens/company/ListCompany";
import SetDetailCompany from "./screens/company/SetDetailCompany";
import SetAddCompany from "./screens/company/SetAddCompany";
import DetailCompanyReview from "./screens/company/DetailCompanyReview";

/* 대기 상태 사업자 회원 관리 */
// setCompanyDetailInfo.status 사용 방법 변경 및 선택적 사업자 회원의 안심번호 등록으로 해당 기능 주석처리
import ListWaiting from "./screens/waitinglist/ListWaiting";
import SetWaiting from "./screens/waitinglist/SetWaiting";

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

/* 앱 홈화면 배너 관리 */
import SetAdminAppbanner from "./screens/appbanner/SetAdminAppbanner";

/* 관할지역 건축과 배너관리 */
import SetConstuctdepartmentbanner from "./screens/constuctdepartmentbanner/SetConstuctdepartmentbanner";
import AddConstuctdepartmentbanner from "./screens/constuctdepartmentbanner/AddConstuctdepartmentbanner";

/* 키워드 조회량 관리 */
// import SetAdminKeywords from "./screens/develop/SetAdminKeywords";

/* 유통만 관리 */
import ListAgentEm from "./screens/agent/ListAgentEm";
import SetAgentEm from "./screens/agent/SetAgentEm";
import ListAgentAg from "./screens/agent/ListAgentAg";
import ListAgentSd from "./screens/agent/ListAgentSd";
import SetAgentSd from "./screens/agent/SetAgentSd";
import SetAgentAg from "./screens/agent/SetAgentAg";

/* 공사콕 이밴트 */
import ListEvent from "./screens/gongsacokevent/ListEvent";
import SetEvent from "./screens/gongsacokevent/SetEvent";

/* 와짱 이밴트 */
import ListWzEvent from "./screens/wzevent/ListWzEvent";
import SetWzEvent from "./screens/wzevent/SetWzEvent";

/* 건의사항 */
import ListSuggest from "./screens/suggest/ListSuggest";

/* 이미지 관리 */
import ListImgs from "./screens/imagesetting/ListImgs";
import SetImgs from "./screens/imagesetting/SetImgs";
// import WzSetImgs from "./screens/imagesetting/WzSetImgs";

// 판매가능 키워드 확인
import ListKeywords from "./screens/keywords/ListKeywords";

// 안심번호
import SetSafeNumber from "./screens/company/SetSafeNumber";

// 녹취록
import SetRecord from "./screens/record/SetRecord";
import ListRecord from "./screens/record/ListRecord";

// 대용량 안심번호
import SafeNumberUpload from "./screens/safeNumberUpload/SafeNumberUpload";

// B2C, B2B 새로운 게시글
import ListLocalcontent from "./screens/localcontent/ListLocalcontent";
// import GetLocalcontent from "./screens/localcontent/GetLocalcontent";
import SetLocalcontent from "./screens/localcontent/SetLocalcontent";

// 공사콕 어플 점검 예고
import InspectionTime from "./screens/inspectionTime/InspectionTime";

import * as API from "./service/api";
import * as ST from "./service/useData/storage";
import * as STR from "./service/string/stringtoconst";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const ISUSER = ST.servicesGetStorage(STR.TOKEN);
  const notLoginScreens = location.pathname !== "/login";
  let currentPath = useRef("");

  const fnHomeLink = () => {
    navigate("/company");
  };

  // 로컬에 token이 없으면서 현재 페이지가 login이 아닐 때
  const fnUserCheck = () => {
    if (!ISUSER && notLoginScreens) {
      navigate("/login");
      return;
    }
  };

  // const setSafeNumberList = async () => {
  //   const list = await SAFE.serviesSafeNumSearch([]);
  //   STO.servicesSetStorage("SAFENUMBERLIST", list);
  // };

  useEffect(() => {
    // url "/"을 통합회원관리로 이동하도록 설정
    if (location.pathname === "/") {
      fnHomeLink();
    }

    // 로컬에 token이 없으면서 현재 페이지가 login이 아닐 때면 login 으로 이동
    fnUserCheck();

    //refresh token 다시 받아오기 이벤트, 현재 10시간마다 토큰을 받아오는 것으로 설정
    if (notLoginScreens) {
      const tokenCheckTime = 3600000 * 10;
      setTimeout(API.servicesGetRefreshToken, tokenCheckTime);
    }

    // 추후에 로그인 시 사용가능한 안심번호 리스트를 가지고 오도록 수정
    // setSafeNumberList();
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
        limit={1}
        theme="light"
      />
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout nowTitle="전체 회원 관리" component={<ListUser />} />
          }
        />
        <Route path="login" element={<Login />} />
        <Route
          path="user"
          element={
            <MainLayout nowTitle="전체 회원 관리" component={<ListUser />} />
          }
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
        <Route
          path="resignuser"
          element={
            <MainLayout
              nowTitle="탈퇴요청 관리"
              component={<ListResignuser />}
            />
          }
        />
        <Route
          path="company"
          element={
            <MainLayout
              nowTitle="사업자 회원 관리"
              component={<ListCompany />}
            />
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
          path="company/add"
          element={
            <MainLayout nowTitle="사업자 추가" component={<SetAddCompany />} />
          }
        />
        <Route
          path="waitinglist"
          element={
            <MainLayout
              nowTitle="대기 / 거절 상태 사업자 회원 관리"
              component={<ListWaiting />}
            />
          }
        />
        <Route
          path="waitinglist/:cid"
          element={
            <MainLayout
              nowTitle="대기 / 거절 상태 사업자 상세 정보"
              component={<SetWaiting />}
            />
          }
        />
        <Route
          path="csvupload"
          element={
            <MainLayout
              nowTitle="대용량 사업자 데이터 추가"
              component={<SetCsvUpload />}
            />
          }
        />
        <Route
          path="safenumberupload"
          element={
            <MainLayout
              nowTitle="대용량 안심번호 관리"
              component={<SafeNumberUpload />}
            />
          }
        />
        {/* ------- 공지사항 ------- */}
        <Route
          path="company/:cid/notice"
          element={
            <MainLayout
              nowTitle="사업자 이벤트 & 공지사항"
              component={<ListCompanyNotice />}
            />
          }
        />
        <Route
          path="company/:cid/notice/set"
          element={
            <MainLayout
              nowTitle="사업자 이벤트 & 공지사항 작성"
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
              nowTitle="모든 견적의뢰서 관리"
              component={<ListEstimateinfo />}
            />
          }
        />
        <Route
          path="estimateinfo/add"
          element={
            <MainLayout
              nowTitle="견적의뢰서 추가"
              component={<SetAdminEstimateinfo />}
            />
          }
        />
        <Route
          path="estimateinfo/:esid"
          element={
            <MainLayout
              nowTitle="견적의뢰서 상세 관리"
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
              nowTitle="견적의뢰서 / 견적서 관리"
              component={<ListProposalinfo />}
            />
          }
        />
        <Route
          path="proposalInfo/add"
          element={
            <MainLayout
              nowTitle="견적서 추가"
              component={<SetAdminProposalInfo />}
            />
          }
        />
        <Route
          path="proposalInfo/:prid"
          element={
            <MainLayout
              nowTitle="견적서 상세 관리"
              component={<SetAdminProposalInfo />}
            />
          }
        />
        <Route
          path="estimateinfo/:esid/proposalInfo/:fromUid/:toUid"
          element={
            <MainLayout
              nowTitle="견적서 작성"
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
          path="localcontent"
          element={
            <MainLayout
              nowTitle="최신글 관리"
              component={<ListLocalcontent />}
            />
          }
        />
        <Route
          path="localcontent/:id"
          element={
            <MainLayout
              nowTitle="최신글 상세 관리"
              component={<SetLocalcontent />}
            />
          }
        />
        <Route
          path="localcontent/add"
          element={
            <MainLayout
              nowTitle="최신글 상세 관리"
              component={<SetLocalcontent />}
            />
          }
        />
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
              nowTitle="앱 홈화면 배너 관리"
              component={<SetAdminAppbanner />}
            />
          }
        />
        <Route
          path="constuctdepartmentbanner"
          element={
            <MainLayout
              nowTitle="관할지역 건축과 배너 관리"
              component={<SetConstuctdepartmentbanner />}
            />
          }
        />
        <Route
          path="constuctdepartmentbanner/add"
          element={
            <MainLayout
              nowTitle="관할지역 건축과 배너 관리"
              component={<AddConstuctdepartmentbanner />}
            />
          }
        />
        {/* ------- 배너 관리 ------- */}
        <Route
          path="event"
          element={
            <MainLayout nowTitle="와짱 이벤트 관리" component={<ListEvent />} />
          }
        />
        <Route
          path="event/set"
          element={
            <MainLayout nowTitle="와짱 이벤트 추가" component={<SetEvent />} />
          }
        />
        <Route
          path="event/:contid/set"
          element={
            <MainLayout nowTitle="와짱 이벤트 수정" component={<SetEvent />} />
          }
        />
        {/* ------- 와짱 이벤트 관리 ------- */}
        <Route
          path="wzevent"
          element={
            <MainLayout
              nowTitle="와짱 이벤트 신청자 목록"
              component={<ListWzEvent />}
            />
          }
        />
        <Route
          path="wzevent/:gweid"
          element={
            <MainLayout
              nowTitle="와짱 이벤트 신청자 수정"
              component={<SetWzEvent />}
            />
          }
        />
        {/* ------- 건의사항 ------- */}
        <Route
          path="suggest"
          element={
            <MainLayout nowTitle="건의사항" component={<ListSuggest />} />
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
          path="agentem/:daid"
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
          path="agentsd/:daid"
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
          path="agentag/:daid"
          element={
            <MainLayout
              nowTitle="지점 ( 대리점 ) 수정"
              component={<SetAgentAg />}
            />
          }
        />
        {/* ------- 안심번호 ------- */}
        <Route
          path="company/:cid/safenumber"
          element={
            <MainLayout
              nowTitle="안심번호 등록"
              component={<SetSafeNumber />}
            />
          }
        />
        <Route
          path="company/:cid/safenumber/:vno"
          element={
            <MainLayout
              nowTitle="안심번호 수정"
              component={<SetSafeNumber />}
            />
          }
        />
        <Route
          path="waitinglist/:cid/safenumber"
          element={
            <MainLayout
              nowTitle="안심번호 등록"
              component={<SetSafeNumber />}
            />
          }
        />
        {/* ------- 녹취록 ------- */}
        <Route
          path="record"
          element={
            <MainLayout
              nowTitle="녹취록 전체 관리"
              component={<ListRecord />}
            />
          }
        />
        <Route
          path="company/:cid/record"
          element={
            <MainLayout nowTitle="녹취록 관리" component={<ListRecord />} />
          }
        />
        <Route
          path="company/:cid/record/:fid"
          element={
            <MainLayout nowTitle="녹취록 관리" component={<SetRecord />} />
          }
        />

        <Route
          path="record/:fid"
          element={
            <MainLayout nowTitle="녹취록 관리" component={<SetRecord />} />
          }
        />
        {/* ------- 이미지 관리 ------- */}
        <Route
          path="setimgs"
          element={
            <MainLayout nowTitle="이미지 관리" component={<ListImgs />} />
          }
        />
        <Route
          path="setimgs/add"
          element={
            <MainLayout nowTitle="이미지 추가" component={<SetImgs />} />
          }
        />
        {/* <Route
          path="setimgs/wzadd"
          element={
            <MainLayout
              nowTitle="와짱에서 이미지 가져오기"
              component={<WzSetImgs />}
            />
          }
        /> */}
        {/* 판매가능 키워드 확인 */}
        <Route
          path="allkeyword"
          element={
            <MainLayout
              nowTitle="판매가능 키워드 확인"
              component={<ListKeywords />}
            />
          }
        />
        {/* 공사콕 점검 예고  */}
        <Route
          path="inspectiontime"
          element={
            <MainLayout
              nowTitle="공사콕 점검 예고 관리"
              component={<InspectionTime />}
            />
          }
        />
        {/* 외부 사이트 연결로 인한 Nav 숨김 처리 */}
        {/* <Route
          path="safement"
          element={
            <MainLayout
              nowTitle="안심번호 멘트 관리"
              component={<List050Ment />}
            />
          }
        />
        <Route
          path="safement/add"
          element={
            <MainLayout
              nowTitle="안심번호 멘트 추가"
              component={<Set050Ment />}
            />
          }
        />
        <Route
          path="safement/:mentid"
          element={
            <MainLayout
              nowTitle="안심번호 멘트 수정"
              component={<Set050Ment />}
            />
          }
        /> */}
      </Routes>
    </div>
  );
}

export default App;
