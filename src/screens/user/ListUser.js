// 회원관리 > 통합회원 관리 리스트

import { Link } from "react-router-dom";
import { useState } from "react";

import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

import PageButton from "../../components/services/ServicesPaginationButton_Redux";
import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentListUserSearch from "../../components/common/ComponentListUserSearch";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

function ListInTr({ item, setClickedUseFlag, clickedUseFlag }) {
  // 체크박스 상태 ------------------------------------------------------------------------
  // useFlagCk:계약관리
  const [useFlagCk, setUseFlagCk] = useState(false);

  // cid값 저장
  const addCheck = (name, isChecked) => {
    (() => {
      if (isChecked) {
        setClickedUseFlag([...clickedUseFlag, name]);
        // 동일한 선택을 할 때 중복 선택되지 않도록 설정
      } else if (!isChecked && clickedUseFlag.includes(name)) {
        setClickedUseFlag(clickedUseFlag.filter((it) => it !== name));
      }
    })();
  };

  // 체크 이벤트 동작 & 상위 컴포넌트에게 전달하기 위한 이벤트 동작
  const handleCheck = ({ target }) => {
    // 체크박스 상태관리
    setUseFlagCk(!useFlagCk);
    // cid 추가, 삭제 이벤트
    addCheck(target.name, target.checked);
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          name={item.uid}
          checked={useFlagCk}
          id="useFlag"
          onChange={handleCheck}
        />
      </td>
      <td className="tableButton">
        <Link to={`${item.uid}`} className="Link">
          {item.uid}
        </Link>
      </td>
      <td className="tableButton">
        {!!item.cid && (
          <Link to={`/company/${item.cid}`} className="Link">
            {item.cid}
          </Link>
        )}
      </td>
      <td>{item.userid}</td>
      <td>{item.name}</td>
      <td>
        {item.userrole && item.userrole.includes("ROLE_ADMIN") ? (
          <i className="tableIcon" style={{ backgroundColor: "orange" }}>
            관리자
          </i>
        ) : (
          <i className="tableIcon">일반</i>
        )}
      </td>
      <td>{item.mobile}</td>

      <td>{item.createTime && item.createTime.slice(0, 10)}</td>
      {/* <td>{item.udid ? <i className="tableIcon">입력</i> : null}</td> */}
    </tr>
  );
}

// ====================================================================================
// 부모
// ====================================================================================
export default function ListUser() {
  // 목록 데이터
  const [userList, setUserList] = useState([]);

  // 회원관리, 상태관리 cid 저장
  const [clickedUseFlag, setClickedUseFlag] = useState([]);

  // 계약관리 submit
  const handleUseFlag = (e) => {
    // useFlag 활성화(정상) 버튼 클릭 시 useFlag:1, 해지 버튼 클릭시 useFlag:0
    for (let i = 0; i < clickedUseFlag.length; i++) {
      API.servicesPostData(APIURL.urlSetUser, {
        uid: clickedUseFlag[i],
        useFlag: e.target.id === "useFlagUse" ? "1" : "0",
      }).then(() => {
        TOA.servicesUseToast("작업이 완료되었습니다.", "s");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    }
  };

  return (userList == [] && userList.length == 0) || userList === undefined ? (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`add`} text="작성" />
      </ul>
      <ComponentErrorNull />
    </>
  ) : (
    <>
      <ComponentListUserSearch setUserList={setUserList} />

      <ul className="tableTopWrap">
        {clickedUseFlag.length > 0 && (
          <LayoutTopButton text="정상" fn={handleUseFlag} id="useFlagUse" />
        )}
        {clickedUseFlag.length > 0 && (
          <LayoutTopButton text="해지" fn={handleUseFlag} />
        )}
        {clickedUseFlag.length === 0 && (
          <LayoutTopButton url="add" text="회원 추가" />
        )}
      </ul>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "100px" }}> 활성화 계정</th>
                <th style={{ width: "80px" }}>관리번호</th>
                <th style={{ width: "120px" }}>사업자 관리번호</th>
                <th style={{ width: "auto" }}>아이디</th>
                <th style={{ width: "150px" }}>이름</th>
                <th style={{ width: "100px" }}>회원 권한</th>
                <th style={{ width: "auto" }}>휴대폰</th>
                <th style={{ width: "150px" }}>계약일</th>
                {/* <th style={{ width: "70px" }}>상세입력</th> */}
              </tr>
            </thead>
            <tbody>
              {/* checkbox를 별도로 관리하기 위해 컴포넌트로 관리 */}
              {userList.map((item, index) => (
                <ListInTr
                  item={item}
                  key={item.uid}
                  clickedUseFlag={clickedUseFlag}
                  setClickedUseFlag={setClickedUseFlag}
                />
              ))}
            </tbody>
          </table>
          <PageButton />
        </div>
      </section>
    </>
  );
}
