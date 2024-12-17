import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import ServiceModalPayment from "../services/ServiceModalPayment";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

export function ChlidList({ data }) {
  const [showModal, setShowModal] = useState(false);
  const formatISODate = (date) => {
    return date ? date.split("T")[0] : null;
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const getPaymentMethodNameLabel = (paymentMethod) => {
    switch (paymentMethod) {
      case "신용카드":
        return "카드소유자";
      case "CMS ( 자동이체 )":
        return "CMS예금주";
      case "무통장입금":
        return "입금자명";
      default:
        return;
    }
  };

  const getPaymentDateLabel = (paymentMethod, chargeType) => {
    if (chargeType === "월 이용료 ( 후불 )") {
      return "월 이용료 청구일";
    }
    switch (paymentMethod) {
      case "신용카드":
        return "승인일";
      case "CMS ( 자동이체 )":
        return "출금일";
      case "무통장입금":
        return "입금일";
      default:
        return "결제일";
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    API.servicesPostData(APIURL.urlsetPayment, {
      ...data,
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
      {showModal && (
        <ServiceModalPayment
          setClick={setShowModal}
          click={showModal}
          pid={data.pid}
        />
      )}
      <tr>
        <td className="Payment-data-Payment">
          <div>
            <p>{data.chargeType || "미지정"}</p>
            <p>{data.payment}</p>
          </div>
          <div className="Payment-data-button">
            <button
              className="button-Edit"
              onClick={(e) => handleEdit(e, data.pid)}
            >
              수정
            </button>
            <button className="button-Delete" onClick={handleDelete}>
              삭제
            </button>
          </div>
        </td>
        <td className="Payment-data-content">
          <ul>
            {data.paymentPlan === "무료" ? (
              <li>
                <span>금액</span> <p>0원</p>
              </li>
            ) : data.amount ? (
              <li>
                <span>할인된 금액</span>
                <p>{data.amount.toLocaleString()}원</p>
              </li>
            ) : null}
            {data.discountAmount > 0 && (
              <li>
                <span>할인 금액</span>
                <p>{data.discountAmount.toLocaleString()}원</p>
              </li>
            )}
            {data.paymentPlan && (
              <li>
                <span>납부방법</span>
                <p>{data.paymentPlan}</p>
              </li>
            )}
            {data.package && (
              <li>
                <span>결합상품</span> <p>{data.package}</p>
              </li>
            )}
            {data.startDate && (
              <li>
                <span>선납 시작일</span> <p>{formatISODate(data.startDate)}</p>
              </li>
            )}
            {data.endDate && (
              <li>
                <span>선납 만료일</span> <p>{formatISODate(data.endDate)}</p>
              </li>
            )}
            {data.paymentDate && (
              <li>
                <span>
                  {getPaymentDateLabel(data.payment, data.chargeType)}
                </span>
                <p>{formatISODate(data.paymentDate)}</p>
              </li>
            )}
            {data.chargeEndDate && (
              <li>
                <span>요금 만료일</span>{" "}
                <p>{formatISODate(data.chargeEndDate)}</p>
              </li>
            )}
            {data.useBank && (
              <li>
                <span>
                  {data.payment === "무통장입금"
                    ? "은행명"
                    : data.payment === "신용카드"
                    ? "카드사"
                    : data.payment === "CMS ( 자동이체 )"
                    ? "은행명"
                    : ""}
                </span>
                <p>{data.useBank}</p>
              </li>
            )}
            {data.name && (
              <li>
                <span>{getPaymentMethodNameLabel(data.payment)}</span>{" "}
                <p>{data.name}</p>
              </li>
            )}
            {data.birthDate && (
              <li>
                <span>생년월일</span> <p>{data.birthDate}</p>
              </li>
            )}
            {data.comType && (
              <li>
                <span>사업자구분</span> <p>{data.comType}</p>
              </li>
            )}
            {data.registration && (
              <li>
                <span>사업자번호</span>{" "}
                <p style={{ fontSize: "0.7rem" }}>{data.registration}</p>
              </li>
            )}
            {data.cmsNum && (
              <li>
                <span>CMS 회원번호</span> <p>{data.cmsNum}</p>
              </li>
            )}
            {data.ktNum && (
              <li>
                <span>KT합산청구번호</span> <p>{data.ktNum}</p>
              </li>
            )}
            {data.cardnum && (
              <li>
                <span>카드번호</span>{" "}
                <p style={{ fontSize: "0.7rem" }}>{data.cardnum}</p>
              </li>
            )}
            {data.cardValidnum && (
              <li>
                <span>카드 유효기간</span> <p>{data.cardValidnum}</p>
              </li>
            )}
            {data.relationship && (
              <li>
                <span>계약자와의 관계</span> <p>{data.relationship}</p>
              </li>
            )}
            {data.telnum && (
              <li>
                <span>휴대폰</span> <p>{data.telnum}</p>
              </li>
            )}
            {data.payment === "신용카드" && data.accountNum && (
              <li>
                <span>승인번호</span>{" "}
                <p style={{ fontSize: "0.7rem" }}>{data.accountNum}</p>
              </li>
            )}
            {data.payment !== "신용카드" &&
              data.accountNum &&
              data.payment !== "무통장입금" && (
                <li>
                  <span>계좌번호</span>{" "}
                  <p style={{ fontSize: "0.7rem" }}>{data.accountNum}</p>
                </li>
              )}
            {data.payment === "신용카드" && (
              <li>
                <span>할부정보</span>
                <p>
                  {data.paymentType === "0"
                    ? "일시불"
                    : `할부 ( ${data.installmentMonths}개월 )`}
                </p>
              </li>
            )}
            {data.remark && (
              <li style={{ width: "98.75%" }}>
                <span>비고</span>{" "}
                <p style={{ width: "100%", padding: "10px 0" }}>
                  {data.remark}
                </p>
              </li>
            )}
          </ul>
        </td>
      </tr>
    </>
  );
}

export default function ComponentPayment() {
  const { cid, uid } = useParams();
  const [listItems, setListItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [IDNUM, setIDNUM] = useState(null);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const getedSummaryData = useSelector(
    (state) => state.data.getedSummaryData,
    shallowEqual
  );

  const fetchListItems = useCallback(() => {
    const IDNUM = getedSummaryData.ruid || "";
    setIDNUM(IDNUM);
    if (!!IDNUM) {
      API.servicesPostData(APIURL.urllistPayment, {
        ruid: IDNUM,
        offset: 0,
        size: 10,
      })
        // })
        .then((res) => {
          if (res.status === "success") {
            setListItems(res.data);
          } else {
            setListItems([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [cid, setListItems, getedSummaryData]);

  useEffect(() => {
    fetchListItems();
  }, [fetchListItems]);

  const handleDiscountChange = (discount) => {
    setTotalDiscount(discount);
  };

  const calculateTotalAmount = (listItems) => {
    let totalAmount = 0;
    for (const data of listItems) {
      totalAmount += data.amount - (data.DiscountAmount || 0);
    }
    return totalAmount.toLocaleString();
  };

  const TotalAmount = calculateTotalAmount(listItems);

  const handleAddButtonClick = (e) => {
    e.preventDefault();
    if (IDNUM) {
      setShowModal(true);
    } else {
      TOA.servicesUseToast(
        "회원관리번호가 존재하지 않아 결제수단을 관리를 할 수 없습니다.",
        "e"
      );
    }
  };

  return (
    <>
      <fieldset
        id="CompanyDetail_9"
        style={{
          paddingBottom: listItems.length > 0 ? "0" : "6%",
        }}
      >
        <h3>
          결제수단
          <button type="submit" onClick={handleAddButtonClick}>
            추가
          </button>
        </h3>

        {showModal && (
          <ServiceModalPayment setClick={setShowModal} click={showModal} />
        )}

        {listItems.length > 0 && (
          <div className="listPayment-data" style={{ width: "100%" }}>
            <table className="listPayment-table">
              <tbody className="Payment-data">
                {listItems.map((data, index) => (
                  <ChlidList
                    key={index}
                    data={data}
                    onDiscountChange={handleDiscountChange}
                  />
                ))}
              </tbody>
              <tbody className="Payment-data Payment-data-Amount">
                <tr>
                  <td
                    className="Payment-data-Payment"
                    style={{ padding: "0px" }}
                  >
                    총금액
                  </td>
                  <td className="Payment-data-content">
                    <p>{TotalAmount} 원</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </fieldset>
    </>
  );
}
