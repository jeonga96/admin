import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../../service/api";
// import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as STR from "../../service/string";
import * as UD from "../../service/useData";

import ServiceModalCustomer from "../services/ServiceModalCustomer";

// 상담 아이템을 렌더링하는 컴포넌트
function ChlidList({ item }) {
  const [showModal, setShowModal] = useState(false);

  const changeDate = new Date(item.changeDate).toISOString().split("T")[0];
  const createDate = new Date(item.createTime).toISOString().split("T")[0];

  // 수정 처리 함수
  const handleEdit = (e, ccid) => {
    e.preventDefault();
    setShowModal(true);
  };

  // 삭제 처리 함수
  const handleDelete = (e) => {
    e.preventDefault();
    API.servicesPostData(STR.urlSetCustomerConsult, {
      ...item,
      useFlag: 0,
    }).then((res) => {
      console.log(res);
      UD.servicesUseToast("삭제되었습니다.", "s");
      setTimeout(() => {
        document.location.reload();
      }, 1500);
    });
  };

  // 변경 일자를 ISO 형식으로 변환

  return (
    <>
      <ServiceModalCustomer
        setClick={setShowModal}
        click={showModal}
        CCID={item.ccid}
      />

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
  const { cid, uid } = useParams(); // URL 파라미터에서 cid, uid를 가져옴
  const [showModal, setShowModal] = useState(false); // 모달을 표시할지 결정하는 상태
  const [listItems, setListItems] = useState([]); // 리스트 아이템을 저장하는 상태

  // 컴포넌트가 마운트되거나 업데이트될 때 실행되는 useEffect
  const fetchListItems = useCallback(() => {
    // 연결된 uid, cid를 할당하는 변수로 사용
    let IDNUM;

    // 사업자 상세정보 페이지
    if (!!cid) {
      API.servicesPostData(STR.urlGetCompany, { cid: cid }).then((res) => {
        // urlGetCompany cid에 연결된 ruid가 있으면 할당 없을 시 ""
        IDNUM = res.status === "success" ? res.data.ruid : "";

        // list 조회 통신
        API.servicesPostData(STR.urlListCustomerConsult, {
          uid: IDNUM,
          cid: cid,
        }).then((res) => {
          console.log("urlListCustomerConsult", res.data);
          if (res.status === "success") {
            setListItems(res.data);
          } else {
            setListItems([]);
          }
        });
      });
    }

    // 회원 상세정보 페이지
    if (!!uid) {
      API.servicesPostData(STR.urlGetUserCid, { uid: uid }).then((res) => {
        // urlGetCompany cid에 연결된 ruid가 있으면 할당 없을 시 ""
        IDNUM = res.status === "success" ? res.data.cid : "";

        // list 조회 통신 I
        API.servicesPostData(STR.urlListCustomerConsult, {
          uid: uid,
          cid: IDNUM,
        }).then((res) => {
          console.log("urlListCustomerConsult", res.data);
          if (res.status === "success") {
            setListItems(res.data);
          } else {
            setListItems([]);
          }
        });
      });
    }
  }, [showModal]);

  useEffect(() => {
    fetchListItems();
  }, [fetchListItems]);

  return (
    <fieldset id="CompanyDetail_8">
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

      <ServiceModalCustomer setClick={setShowModal} click={showModal} />

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
