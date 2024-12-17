import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

import ServiceModalCustomer from "../services/ServiceModalCustomer";

// 상담 아이템을 렌더링하는 컴포넌트
function ChlidList({ item }) {
  const [showModal, setShowModal] = useState(false);

  const changeDate = item.changeDate
    ? new Date(item.changeDate).toISOString().split("T")[0]
    : "";
  const createDate = item.createTime
    ? new Date(item.createTime).toISOString().split("T")[0]
    : "";

  // 수정 처리 함수
  const handleEdit = (e, ccid) => {
    e.preventDefault();
    setShowModal(true);
  };

  // 삭제 처리 함수
  const handleDelete = (e) => {
    e.preventDefault();
    API.servicesPostData(APIURL.urlSetCustomerConsult, {
      ...item,
      useFlag: 0,
    }).then((res) => {
      console.log(res);
      TOA.servicesUseToast("삭제되었습니다.", "s");
      setTimeout(() => {
        document.location.reload();
      }, 1500);
    });
  };

  return (
    <>
      {showModal && (
        <ServiceModalCustomer
          setClick={setShowModal}
          click={showModal}
          CCID={item.ccid}
        />
      )}

      <li className="counseling-item">
        <div
          className="item-header"
          style={{ justifyContent: "space-between" }}
        >
          <div className="body-left">
            <span>작성 일시: {createDate}</span>
            <span>상담 사원: {item.writer}</span>
            <span>상담 유형: {item.type}</span>
          </div>
          <div>
            <button onClick={handleDelete}>삭제</button>
            <button onClick={(e) => handleEdit(e, item.ccid)}>수정</button>
          </div>
        </div>
        {!!item.safeNumber || !!item.realNumber ? (
          <div className="item-body">
            <span>착신번호 : {item.realNumber}</span>
            <span>안심번호 : {item.safeNumber}</span>
            <span>변경날짜 : {changeDate}</span>
          </div>
        ) : null}

        <p className="counseling-content">{item.content}</p>
      </li>
    </>
  );
}

export default function CustomerCounseling() {
  const getedSummaryData = useSelector(
    (state) => state.data.getedSummaryData,
    shallowEqual
  );
  const { cid, uid } = useParams(); // URL 파라미터에서 cid, uid를 가져옴
  const [showModal, setShowModal] = useState(false); // 모달을 표시할지 결정하는 상태
  const [listItems, setListItems] = useState([]); // 리스트 아이템을 저장하는 상태

  // 컴포넌트가 마운트되거나 업데이트될 때 실행되는 useEffect
  const fetchListItems = useCallback(() => {
    // 연결된 uid, cid를 할당하는 변수로 사용
    // 사업자 상세정보 페이지
    API.servicesPostData(APIURL.urlListCustomerConsult, {
      uid: getedSummaryData.ruid,
      cid: cid,
    }).then((res) => {
      if (res.status === "success") {
        setListItems(res.data);
      } else {
        setListItems([]);
      }
    });

    // 회원 상세정보 페이지
    if (!!uid) {
      API.servicesPostData(APIURL.urlGetUserCid, { uid: uid }).then((res) => {
        // urlGetCompany cid에 연결된 ruid가 있으면 할당 없을 시 ""
        if (res !== undefined) {
          let IDNUM = res.status === "success" ? res.data.cid : "";
          // list 조회 통신 I
          API.servicesPostData(APIURL.urlListCustomerConsult, {
            uid: uid,
            cid: IDNUM,
          }).then((res) => {
            if (res.status === "success") {
              setListItems(res.data);
            } else {
              setListItems([]);
            }
          });
        }
      });
    }
  }, [showModal]);

  useEffect(() => {
    fetchListItems();
  }, [fetchListItems]);

  return (
    <fieldset
      id="CompanyDetail_8"
      style={{
        paddingBottom: listItems.length > 0 ? "0" : "5%",
      }}
    >
      <h3>
        고객상담
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          등록
        </button>
      </h3>

      {showModal && (
        <ServiceModalCustomer setClick={setShowModal} click={showModal} />
      )}

      {listItems.length > 0 && (
        <div className="counseling-list">
          <ul>
            {listItems.map((item, index) => (
              <ChlidList key={index} item={item} index={index} />
            ))}
          </ul>
        </div>
      )}
    </fieldset>
  );
}
