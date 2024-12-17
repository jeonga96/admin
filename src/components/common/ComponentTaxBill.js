import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";

import ServiceModalTaxBill from "../services/ServiceModalTaxBill";

// ------------------------------------------------------------------------------------
export function ChlidList({ item }) {
  const [showModal, setShowModal] = useState(false);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear().toString().slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}.${month}.${day}`;
  };

  const date = item.date ? formatDate(item.date) : "";
  const updateDate = item.updateDate ? formatDate(item.updateDate) : "";

  // 수정 처리 함수
  const handleEdit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // 삭제 처리 함수
  const handleDelete = (e) => {
    e.preventDefault();
    API.servicesPostData(APIURL.urlsetTaxBill, {
      ...item,
      useFlag: 0,
    }).then((res) => {
      TOA.servicesUseToast("삭제되었습니다.", "s");
      setTimeout(() => {
        document.location.reload();
      }, 1500);
    });
  };

  return (
    <>
      <ul className="listTaxBill-td-content">
        {showModal && (
          <ServiceModalTaxBill
            setClick={setShowModal}
            click={showModal}
            TBID={item.tbid}
          />
        )}
        <li style={{ width: "10%" }}>
          {String(item.registration)
            .replace(/[^0-9]/g, "")
            .replace(/([0-9]{3})([0-9]{2})([0-9]+)/, "$1-$2-$3")
            .replace("--", "-")}
        </li>
        <li style={{ width: "12%" }}>{item.name}</li>
        <li style={{ width: "16%", fontSize: "0.65rem" }}>{item.address}</li>
        <li style={{ width: "12%" }}>{item.industry}</li>
        <li style={{ width: "12%" }}>{item.job}</li>
        <li style={{ width: "12%", fontSize: "0.7rem" }}>{item.email}</li>
        <li style={{ width: "6%" }}>{date}</li>
        <li style={{ width: "6%" }}>{updateDate ? updateDate : date}</li>
        <li style={{ width: "8%" }}>
          {String(item.price).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} 원
        </li>
        <li style={{ width: "6%" }} className="listTaxBill-button">
          <button
            style={{ color: "rgb(51, 68, 124)", marginLeft: "3px" }}
            onClick={(e) => handleEdit(e, item.tbid)}
          >
            수정
          </button>
          <button
            style={{ color: "rgb(155, 17, 30)", marginRight: "3px" }}
            onClick={handleDelete}
          >
            삭제
          </button>
        </li>
      </ul>
    </>
  );
}

export default function ComponentTaxBill() {
  const { cid, rcid } = useParams();
  const [listItems, setListItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchListItems = useCallback(() => {
    API.servicesPostData(APIURL.urllistTaxBill, {
      rcid: cid,
    })
      .then((res) => {
        if (res && res.status === "success") {
          setListItems(res.data);
        } else {
          setListItems([]);
        }
      })
      .catch((error) => {
        console.error("Error during API request:", error);
        setListItems([]);
      });
  }, [showModal]);

  useEffect(() => {
    fetchListItems();
  }, [fetchListItems]);

  return (
    <>
      <fieldset id="CompanyDetail_10">
        <h3>
          세금계산서
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowModal(true);
            }}
          >
            추가
          </button>
        </h3>
        {showModal && (
          <ServiceModalTaxBill
            setClick={setShowModal}
            click={showModal}
            rcid={rcid}
          />
        )}
        <div style={{ width: "100%" }}>
          <table className="listTaxBill-table" style={{ width: "100%" }}>
            <thead className="listTaxBill-thead">
              <tr>
                <td className="listTaxBill-td">
                  <ul
                    className="listTaxBill-td-title"
                    style={{ padding: "2px 0" }}
                  >
                    <li style={{ width: "10%" }}>사업자 번호</li>
                    <li style={{ width: "12%" }}>상호명 / 대표자명</li>
                    <li style={{ width: "16%" }}>주소</li>
                    <li style={{ width: "12%" }}>업태</li>
                    <li style={{ width: "12%" }}>종목</li>
                    <li style={{ width: "12%" }}>이메일</li>
                    <li style={{ width: "6%" }}>작성일자</li>
                    <li style={{ width: "6%" }}>수정일자</li>
                    <li style={{ width: "8%" }}>금액</li>
                    <li
                      style={{
                        width:
                          listItems && listItems.length > 4
                            ? `calc(6% + 20px)`
                            : "6%",
                      }}
                    >
                      관리
                    </li>
                  </ul>
                </td>
              </tr>
            </thead>
            <tbody className="listTaxBill-tbody">
              <tr>
                <td className="listTaxBill-td">
                  {listItems && listItems.length > 0 && (
                    <div>
                      {listItems.map((item, index) => (
                        <ChlidList key={index} item={item} index={index} />
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </fieldset>
    </>
  );
}
