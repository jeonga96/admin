# 관리자페이지 기본 관리

## 1, Screen 폴더

**1, 폴더규칙**

**_company, user등 API의 이름 및 메뉴 이름에 따라 폴더 별로 분리_**

**_develop폴더는 제작 중이거나 현재 사용하지 않지만 삭제 보류 중인 파일 보관_**

예시

- company
  - AddCompany.js
  - DetailConpanyReview.js
  - ListCompany.js
  - setDetailCompany.js
  - etc.

## 2, 파일 이름규칙

**_확장자는 .js 사용_**

예시

- Add- : 회원추가, 사업자 추가 등
- Detail- : 수정과 상세보기가 따로 설정된 페이지 리뷰, 공지사항의 상세보기
- List- : 목록
- Set- : 수정과 상세보기가 함께 있는 페이지 및 url를 확인하여 추가와 수정이 함께 있는 Set 컴포넌트도 존재한다.
  - url에 uid(회원번호), cid(사업자번호)등 회원 번호가 있다면 수정으로 적용

## 3, service import 규칙\*\*

```jsx
import * as API from "../../service/api";
import * as MO from "../../service/library/modal";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as RAN from "../../service/useData/rander";
import * as RC from "../../service/useData/roleCheck";
import * as TOKEN from "../../service/useData/token";
```

- axios(API), url link(STR) 등 service 폴더 내 파일을 import 하기 위한 규칙

**4, 상세페이지 상단의 position:fix - tableTop component**

tableTopScrollBtnData | ComponentTableTopNumber | LayoutTopButton

- **tableTopScrollBtnData**

```jsx
// function(){} 외부 코드
import LayoutTopButton from "../components/common/LayoutTopButton";

// function(){} 내부 코드
const tableTopScrollBtnData = useRef([
    { idName: "CompanyDetail_1", text: "계약 기본 정보" },
    { idName: "CompanyDetail_2", text: "사업자 기본 정보" },
    { idName: "CompanyDetail_3", text: "사업자 정보" },
    { idName: "CompanyDetail_4", text: "청구결제사항" },
    { idName: "CompanyDetail_5", text: "견적 관리" },
    { idName: "CompanyDetail_6", text: "고객 관리" },
  ]);

<ul className="tableTopWrap tableTopBorderWrap">
    <ComponentTableTopScrollBtn data={tableTopScrollBtnData.current} />
</ul>

<fieldset id="CompanyDetail_1">
  <h3>계약 기본 정보</h3>
  ...
</fieldset>
```

## 5, 이미지 컴포넌트 사용 방법

```jsx
// function(){} 외부 코드
import SetImage from "../components/services/ServicesImageSetPreview";

// function(){} 내부 코드

// 각 id에 맞게 initialState로 저당되기 때문에 이를 사용하기 위해 useSelector사용
const titleImg = useSelector((state) => state.imgData, shallowEqual);
const imgs = useSelector((state) => state.imgsData, shallowEqual);
const regImgs = useSelector((state) => state.multiImgsData, shallowEqual);

// ServicesImageSetPreview 컴포넌트에서 useSelector를 통해 getedData를 가지고 오기 때문에
// dispatch serviceGetedData만 해줘도 이미지 컴포넌트 사용 가능
dispatch({
            type: "serviceGetedData",
            payload: { ...res.data },
          });

// 컴포넌트 사용 시 id과 왼쪽 표의 label값인 title을 prop으로 전달
<SetImage id="regImgs" title="사업자 등록증" />
<SetImage id="titleImg" title="대표 이미지" />
<SetImage id="imgs" title="상세 이미지" />
```

## 6, 주소 컴포넌트 사용 방법

```jsx
// function(){} 외부 코드
import PieceRegisterSearchPopUp from "../components/services/ServiceRegisterSearchPopUp";

// function(){} 내부 코드
// ServiceRegisterSearchPopUp 컴포넌트에서 useSelector를 통해 getedData를 가지고 오기 때문에
// dispatch serviceGetedData만 해줘도 주소 컴포넌트 사용 가능
// kakao API 사용 중
const multilAddress = useSelector(
  (state) => state.multilAddressData,
  shallowEqual
);

<PieceRegisterSearchPopUp />;
```

## 7, 상세관리 내 서브링크

```jsx
// function(){} 외부 코드
import PieceDetailListLink from "../components/piece/PieceDetailListLink";

// function(){} 내부 코드
// useLink props는 조회 비활성화를 기능을 위해 사용
<ul className="detailContent">
  <PieceDetailListLink
    getData={toEstimateinfo}
    url={`toestimateinfo`}
    title="요청"
    useLink={toEstimateinfo && toEstimateinfo.length > 0 ? true : false}
  />
  <PieceDetailListLink
    getData={fromEstimateinfo}
    url={`fromestimateinfo`}
    title="수령"
    useLink={fromEstimateinfo && fromEstimateinfo.length > 0 ? true : false}
  />
</ul>;
```

---

# 2, 네비게이션 메뉴 추가

## 1, json 추가

- json을 수정하면 자동으로 적용됨
- 외부 사이트 연결 시에도 nav.json에서는 연결되는 링크 자체를 입력하면 됨
- 대메뉴는 배열의 name에 입력, 소메뉴는 subNav.subName, subNav.url에 입력한다.

```jsx
[
    "name": "사업자 회원 관리",
    "subNav": [
      {
        "subName": "사업자 관리",
        "url": "/{pathName}"
      },
      {
        "subName": "견적의뢰서 관리",
        "url": "/estimateinfo"
      },
      {
        "subName": "견적서 관리",
        "url": "/proposalInfo"
      }
    ]
  },
  {
    "name": "와부 사이트 연결",
    "subNav": [
      {
        "subName": "안심번호 상세 관리",
        "url": "https://050web.sejongtelecom.net/"
      }
    ]
  }
]
```

## 2, App.js 페이지 내 태그 추가 및 컴포넌트 추가

```jsx
// 컴포넌트 추가 및 import
import SetDetailCompany from "./screens/company/SetDetailCompany";
import ListCompany from "./screens/company/ListCompany";

// App.js 페이지 내 태그 추가
function App() {
		// 일반 정적 페이지
		<Route
		  path="company"
		  element={
		    <MainLayout
		      nowTitle="사업자 회원 관리"
		      component={<ListCompany />}
		    />
		  }
		/>


		// 동적 페이지
		<Route
		  path="company/:cid"
		  element={
		    <MainLayout
		      nowTitle="사업자 상세정보"
		      component={<SetDetailCompany />}
		    />
		  }
		/>
}
```

# 3, App.js에 사용된 기능

## 1, path 사용을 위한 wrap

```jsx
<Routes>
  <Route
    path="/"
    element={<MainLayout nowTitle="회원 관리" component={<ListUser />} />}
  />
  <Route path="login" element={<Login />} />
</Routes>
```

## 2, 알림창 사용을 위한 wrap

"react-toastify/dist/ReactToastify.css"; 연결 & ToastContainer 감싸기

```jsx
import "react-toastify/dist/ReactToastify.css";

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
</div>;
```

- localstorage에 token이 없으면 login창으로 보내는 이벤트
- refresh token 이벤트 (10시간마다 토큰 받아옴)
- nav의 link 클릭 시 같은 link를 클릭하면 새로고침 이벤트 동작 [(링크 이동→)]

# 4, 사업자 정보의 status 관리

- 보안상 노션 링크 막아두었습니다.

[DetailCompany의 Status 개념 정리]()

# 5, 앱 배너 관리

- 보안상 노션 링크 막아두었습니다.

[공사콕 관리자 앱 배너 관리]()

# 3, 외부 api 서비스

- 보안상 노션 링크 막아두었습니다.

## 1, 지도검색 기능

카카오 개발자 툴에서 지도검색, 우편번호 검색 기능 관리 (회원 상세 & 사업자 상세)

- `port` 및 `도메인 url` 변경 시에 오류가 발생된다면 **카카오 개발자 툴에서 플랫폼 추가**

## 1, 카카오 계정정보

카카오 개발자툴 - 카카오 developers [(링크이동 →)]()

## 2, 안심번호 관리

[공사콕 관리자 안심번호 관리]()

## 3, npm 설치한 라이브러리

[공사콕 관리자 기술자료]()

# 5, Git 자동배포 서버 관리 및 사용방법

[Git 자동배포 서버 관리 및 사용방법]()
