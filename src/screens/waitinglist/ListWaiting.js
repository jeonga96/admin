// 대기 상태 사업자 회원 관리
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import * as PAGE from "../../action/page";

import * as API from "../../service/api";
import * as CUS from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";

import PaginationButton from "../../components/services/ServicesPaginationButton_Redux";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";
import ComponentListWaitingSearch from "../../components/common/ComponentListWaitingSearch";

// 하위 컴포넌트, useState를 별도로 관리하기 위해 하위 컴포넌트로 분리
function ChildList({ item }) {
  return (
    <tr>
      <td className="tableButton">
        <Link to={`${item.cid}`} className="Link">
          {item.cid}
        </Link>
      </td>
      <td>{item.cdname}</td>
      <td>{item.name}</td>
      <td>{item.registration}</td>
      <td>{item.telnum}</td>
      <td>{item.mobilenum}</td>
      <td>{item.createTime && item.createTime.slice(0, 10)}</td>
    </tr>
  );
}

// ====================================================================================
// 부모
// ====================================================================================
export default function Waitinglist() {
  // 목록 데이터
  const [waitinglist, setWaitinglist] = useState([]);
  //리덕스 관련 변수

  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);

  // [체크 박스 - 계약관리,회원상태]
  const [clickedUseFlag, setClickedUseFlag] = useState([]);
  const [clickedStatus, setClickedStatus] = useState([]);

  CUS.useCleanupEffect(() => {
    API.servicesPostData(APIURL.urlCompanylist, {
      offset: pageData.getPage,
      size: 15,
      status: 2,
    })
      .then((res) => {
        const uniqueData = res.data.filter(
          (v, i, a) => a.findIndex((t) => t.cid === v.cid) === i
        );
        setWaitinglist(uniqueData);
        dispatch(PAGE.setListPage(res.page));
      })
      .catch((error) => {
        console.error("API 요청 오류:", error);
      });
  }, [pageData.getPage]);

  return (
    <>
      {(waitinglist == [] && waitinglist.length == 0) ||
      waitinglist === undefined ? (
        <ComponentErrorNull />
      ) : (
        <>
          <ComponentListWaitingSearch setWaitinglist={setWaitinglist} />

          <section className="tableWrap">
            <h3 className="blind">table</h3>
            <div className="commonBox">
              <table className="commonTable">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>관리번호</th>
                    <th style={{ width: "auto" }}>상호명</th>
                    <th style={{ width: "10%" }}>계약자</th>
                    <th style={{ width: "10%" }}>사업자 번호</th>
                    <th style={{ width: "10%" }}>일반전화</th>
                    <th style={{ width: "10%" }}>휴대폰</th>
                    <th style={{ width: "10% " }}>계약일</th>
                  </tr>
                </thead>
                <tbody>
                  {waitinglist.map((item) => (
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
              <PaginationButton />
            </div>
          </section>
        </>
      )}
    </>
  );
}
