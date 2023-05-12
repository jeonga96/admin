import { Link } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { servicesPostData } from "../Services/importData";
import { servicesUseToast } from "../Services/useData";
import {
  urlCompanylist,
  urlSetCompany,
  urlSetCompanyDetail,
} from "../Services/string";

import PaginationButton from "../components/common/PiecePaginationButton";
import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentListCompanySearch from "../components/common/ComponentListCompanySearch";
import ComponentErrorNull from "../components/common/ComponentErrorNull";

// 하위 컴포넌트, useState를 별도로 관리하기 위해 하위 컴포넌트로 분리
function ChildList({
  item,
  setClickedStatus,
  clickedStatus,
  setClickedUseFlag,
  clickedUseFlag,
}) {
  // 체크박스 상태 ------------------------------------------------------------------------
  // useFlagCk:계약관리  statusCk:상태관리
  const [useFlagCk, setUseFlagCk] = useState(false);
  const [statusCk, setStatusCk] = useState(false);

  // id를 확인하여 상태관리와 계약관리를 구분한 후 cid값 저장
  const addCheck = (name, id, isChecked) => {
    (() => {
      if (isChecked) {
        id === "useFlag"
          ? setClickedUseFlag([...clickedUseFlag, name])
          : setClickedStatus([...clickedStatus, name]);
        // 동일한 선택을 할 때 중복 선택되지 않도록 설정
      } else if (!isChecked && clickedUseFlag.includes(name)) {
        setClickedUseFlag(clickedUseFlag.filter((it) => it !== name));
      } else if (!isChecked && clickedStatus.includes(name)) {
        setClickedStatus(clickedStatus.filter((it) => it !== name));
      }
    })();
  };

  // 체크 이벤트 동작 & 상위 컴포넌트에게 전달하기 위한 이벤트 동작
  const handleCheck = ({ target }) => {
    // useFlag 이벤트
    if (target.id === "useFlag") {
      if (clickedStatus.length == 0) {
        // 체크박스 상태관리
        setUseFlagCk(!useFlagCk);
        // cid 추가, 삭제 이벤트
        addCheck(target.name, target.id, target.checked);
      } else {
        servicesUseToast("계약관리와 회원상태를 한 번에 수정하실 수 없습니다.");
      }
    }

    // status 이벤트
    if (target.id === "status") {
      if (clickedUseFlag.length == 0) {
        // 체크박스 상태관리
        setStatusCk(!statusCk);
        // cid 추가, 삭제 이벤트
        addCheck(target.name, target.id, target.checked);
      } else {
        servicesUseToast("계약관리와 회원상태를 한 번에 수정하실 수 없습니다.");
      }
    }
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          name={item.cid}
          checked={useFlagCk}
          id="useFlag"
          onChange={handleCheck}
        />
      </td>
      <td>
        <input
          type="checkbox"
          name={item.cid}
          checked={statusCk}
          id="status"
          onChange={handleCheck}
        />
      </td>
      <td className="tableButton">
        <Link to={`${item.cid}`} className="Link">
          {item.cid}
        </Link>
      </td>
      <td>{item.cdname}</td>
      <td>{item.name}</td>
      <td>{item.regOwner}</td>
      <td>{item.registration}</td>
      <td>{item.telnum}</td>
      <td>
        {item.status == "0" && (
          <i className="tableIcon" style={{ backgroundColor: "red" }}>
            거절
          </i>
        )}
        {item.status == "1" && (
          <i className="tableIcon" style={{ backgroundColor: "green" }}>
            완료
          </i>
        )}
        {item.status == "2" && (
          <i className="tableIcon" style={{ backgroundColor: "orange" }}>
            대기
          </i>
        )}
      </td>
      <td>{item.updateTime && item.updateTime.slice(0, 10)}</td>
      <td>{item.createTime && item.createTime.slice(0, 10)}</td>
    </tr>
  );
}

// 상위 컴포넌트
export default function ListCompany() {
  // 데이터 ------------------------------------------------------------------------
  // 목록 데이터
  const [companyList, setCompanyList] = useState([]);

  // pagination 버튼 관련 ------------------------------------------------------------------------
  // listPage: 컨텐츠 총 개수 / page:전체 페이지 수 & 현재 페이지
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  // [체크 박스 - 계약관리,회원상태]
  const [clickedUseFlag, setClickedUseFlag] = useState([]);
  const [clickedStatus, setClickedStatus] = useState([]);

  useLayoutEffect(() => {
    servicesPostData(urlCompanylist, {
      offset: page.getPage,
      size: 15,
    }).then((res) => {
      setCompanyList(res.data);
      setListPage(res.page);
    });
  }, [page.getPage]);

  // 계약관리 submit
  const handleUseFlagSubmit = (e) => {
    for (let i = 0; i < clickedUseFlag.length; i++) {
      servicesPostData(urlSetCompany, {
        cid: clickedUseFlag[i],
        useFlag: e.target.id === "useFlagY" ? "1" : "0",
      }).then(window.location.reload());
    }
  };

  // 회원상태 submit
  const handleStautsSubmit = (e) => {
    switch (e.target.id) {
      case "waiting":
        for (let i = 0; i < clickedStatus.length; i++) {
          servicesPostData(urlSetCompanyDetail, {
            rcid: clickedStatus[i],
            status: 2,
          }).then(window.location.reload());
        }
        break;
      case "completion":
        for (let i = 0; i < clickedStatus.length; i++) {
          servicesPostData(urlSetCompanyDetail, {
            rcid: clickedStatus[i],
            status: 1,
          }).then(window.location.reload());
        }
        break;
      default:
        for (let i = 0; i < clickedStatus.length; i++) {
          servicesPostData(urlSetCompanyDetail, {
            rcid: clickedStatus[i],
            status: 0,
          }).then(window.location.reload());
        }
        break;
    }
  };
  return (
    <>
      <ComponentListCompanySearch />
      {(companyList == [] && companyList.length == 0) ||
      companyList === undefined ? (
        <>
          <ul className="tableTopWrap">
            <LayoutTopButton url={`add`} text="작성" />
          </ul>
          <ComponentErrorNull />
        </>
      ) : (
        <>
          <ul className="tableTopWrap">
            {clickedUseFlag.length > 0 && (
              <LayoutTopButton
                text="정상"
                fn={handleUseFlagSubmit}
                id="useFlagY"
              />
            )}
            {clickedUseFlag.length > 0 && (
              <LayoutTopButton text="해지" fn={handleUseFlagSubmit} />
            )}
            {clickedStatus.length > 0 && (
              <LayoutTopButton
                text="대기"
                fn={handleStautsSubmit}
                id="waiting"
              />
            )}
            {clickedStatus.length > 0 && (
              <LayoutTopButton
                text="완료"
                fn={handleStautsSubmit}
                id="completion"
              />
            )}
            {clickedStatus.length > 0 && (
              <LayoutTopButton
                text="거절"
                fn={handleStautsSubmit}
                id="refuse"
              />
            )}
            <LayoutTopButton url="add" text="사업자 추가" />
          </ul>
          <section className="tableWrap">
            <h3 className="blind">table</h3>
            <div className="commonBox">
              <table className="commonTable">
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>계약관리</th>
                    <th style={{ width: "60px" }}>회원상태</th>
                    <th style={{ width: "80px" }}>관리번호</th>
                    <th style={{ width: "auto" }}>사업자명</th>
                    <th style={{ width: "100px" }}>계약자</th>
                    <th style={{ width: "100px" }}>대표자명</th>
                    <th style={{ width: "170px" }}>사업자 등록 번호</th>
                    <th style={{ width: "170px" }}>일반전화</th>
                    <th style={{ width: "60px" }}>계약관리</th>
                    <th style={{ width: "110px " }}>수정일</th>
                    <th style={{ width: "110px " }}>계약일</th>
                  </tr>
                </thead>
                <tbody>
                  {companyList.map((item) => (
                    <ChildList
                      item={item}
                      key={item.cid}
                      setClickedStatus={setClickedStatus}
                      clickedStatus={clickedStatus}
                      setClickedUseFlag={setClickedUseFlag}
                      clickedUseFlag={clickedUseFlag}
                    />
                  ))}
                </tbody>
              </table>
              <PaginationButton
                listPage={listPage}
                page={page}
                setPage={setPage}
              />
            </div>
          </section>
        </>
      )}
    </>
  );
}
